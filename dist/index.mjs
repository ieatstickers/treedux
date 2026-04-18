import { combineReducers, configureStore, createReducer } from "@reduxjs/toolkit";
import equal from "fast-deep-equal";
//#region src/enum/default-action-enum.ts
let DefaultActionEnum = /* @__PURE__ */ function(DefaultActionEnum) {
	DefaultActionEnum["BATCH"] = "__BATCH__";
	DefaultActionEnum["SET_BY_KEY_PATH"] = "__SET_BY_KEY_PATH__";
	DefaultActionEnum["DELETE_BY_KEY_PATH"] = "__DELETE_BY_KEY_PATH__";
	return DefaultActionEnum;
}({});
//#endregion
//#region src/utility/objects.ts
var Objects = class {
	static isObject(value) {
		return typeof value === "object" && value !== null;
	}
	static setByKeyPath(keyPath, value, target) {
		const path = [...keyPath];
		const newObject = this.deepCopy(target);
		let currentObj = newObject;
		while (path.length > 0) {
			const key = path.shift();
			if (path.length === 0) {
				if (value === void 0) delete currentObj[key];
				else currentObj[key] = value;
				break;
			}
			if (!currentObj[key]) {
				if (typeof value == "undefined") return newObject;
				currentObj[key] = {};
			}
			currentObj = currentObj[key];
		}
		return newObject;
	}
	static deepCopy(object) {
		if (typeof object !== "object" || object === null) return object;
		const result = Array.isArray(object) ? [] : {};
		for (const key in object) if (Object.prototype.hasOwnProperty.call(object, key)) result[key] = this.deepCopy(object[key]);
		return result;
	}
};
//#endregion
//#region src/data/node-cache.ts
var NodeCache = class {
	cache = /* @__PURE__ */ new Map();
	registry = new FinalizationRegistry((key) => {
		this.cache.delete(key);
	});
	get(keyPath) {
		return this.cache.get(this.toKey(keyPath))?.deref() ?? null;
	}
	set(keyPath, value) {
		const key = this.toKey(keyPath);
		this.cache.set(key, new WeakRef(value));
		this.registry.register(value, key);
	}
	toKey(keyPath) {
		return keyPath.join("\0");
	}
};
//#endregion
//#region src/treedux.ts
const NODE_CACHE = Symbol("treedux.node_cache");
const READ_ONLY_NODE_CACHE = Symbol("treedux.read_only_node_cache");
var Treedux = class Treedux {
	storeInstance;
	dataStores;
	subscribers = /* @__PURE__ */ new Set();
	nodeCache;
	readOnlyNodeCache;
	constructor(dataStores, options) {
		this.dataStores = dataStores;
		this.nodeCache = new NodeCache();
		this.readOnlyNodeCache = new NodeCache();
		options = options || {};
		const reducerMap = {};
		for (const key in this.dataStores) {
			const dataStore = this.dataStores[key];
			dataStore.setTreedux(this);
			reducerMap[key] = createReducer(dataStore.getInitialState(), (builder) => {
				Object.entries(dataStore.getReducers()).forEach(([actionType, reducer]) => builder.addCase(actionType, reducer));
			});
		}
		const appReducer = combineReducers(reducerMap);
		const rootReducer = (state, action) => {
			if (action.type === "__BATCH__") return action.payload.reduce(rootReducer, state);
			else if (action.type === "__SET_BY_KEY_PATH__") {
				const { keyPath, value } = action.payload;
				return Objects.setByKeyPath(keyPath, value, state);
			} else if (action.type === "__DELETE_BY_KEY_PATH__") {
				const { keyPath } = action.payload;
				return Objects.setByKeyPath(keyPath, void 0, state);
			}
			return appReducer(state, action);
		};
		this.storeInstance = configureStore({
			reducer: rootReducer,
			preloadedState: options.initialState
		});
		this.storeInstance.subscribe(() => this.notifySubscribers());
	}
	static init(dataStores, options) {
		return new Treedux(dataStores, options);
	}
	get state() {
		const storeObj = {};
		for (const key in this.dataStores) storeObj[key] = this.dataStores[key].state;
		return storeObj;
	}
	getState() {
		return this.storeInstance.getState();
	}
	subscribe(subscriber) {
		this.subscribers.add(subscriber);
		return () => this.subscribers.delete(subscriber);
	}
	dispatch(...actions) {
		this.storeInstance.dispatch({
			type: "__BATCH__",
			payload: actions.map((action) => action.serialize())
		});
	}
	notifySubscribers() {
		this.subscribers.forEach((subscriber) => subscriber());
	}
	get [NODE_CACHE]() {
		return this.nodeCache;
	}
	get [READ_ONLY_NODE_CACHE]() {
		return this.readOnlyNodeCache;
	}
};
//#endregion
//#region src/data/action.ts
var Action = class Action {
	treedux;
	type;
	payload;
	constructor(action, treedux) {
		this.type = action.type;
		this.payload = action.payload;
		this.treedux = treedux;
	}
	static create(action, treedux) {
		return new Action(action, treedux);
	}
	dispatch() {
		this.treedux.dispatch(this);
	}
	serialize() {
		return {
			type: this.type,
			payload: this.payload
		};
	}
};
//#endregion
//#region src/data/read-only-state-node.ts
var ReadOnlyStateNode = class ReadOnlyStateNode {
	treedux;
	lastKnownValue;
	keyPath = [];
	constructor(options, treedux) {
		this.treedux = treedux;
		this.keyPath = options.keyPath;
	}
	static create(options, treedux) {
		const cache = treedux[READ_ONLY_NODE_CACHE];
		const existing = cache.get(options.keyPath);
		if (existing) return existing;
		const node = new ReadOnlyStateNode(options, treedux).createProxy();
		cache.set(options.keyPath, node);
		return node;
	}
	get() {
		const keys = [...this.keyPath];
		let value = this.treedux.getState();
		while (keys.length > 0) {
			const key = keys.shift();
			if (Objects.isObject(value)) value = value[key];
			else {
				this.lastKnownValue = void 0;
				return this.lastKnownValue;
			}
		}
		this.lastKnownValue = value;
		return this.lastKnownValue;
	}
	subscribe(callback) {
		let currentValue = this.lastKnownValue;
		return this.treedux.subscribe(() => {
			const newValue = this.get();
			if (equal(newValue, currentValue)) return;
			currentValue = newValue;
			callback(currentValue);
		});
	}
	byKey(key) {
		if (!key) throw `Key must be provided to byKey method.`;
		return ReadOnlyStateNode.create({ keyPath: this.keyPath.concat([key.toString()]) }, this.treedux);
	}
	createProxy() {
		return new Proxy(this, {
			get(self, property) {
				if (typeof property !== "string") return null;
				if (typeof self[property] === "function") return self[property].bind(self);
				return ReadOnlyStateNode.create({ keyPath: self.keyPath.concat(property) }, self.treedux);
			},
			ownKeys() {
				return [];
			},
			getOwnPropertyDescriptor() {}
		});
	}
};
//#endregion
//#region src/data/state-node.ts
var StateNode = class StateNode {
	treedux;
	lastKnownValue;
	keyPath = [];
	mutators;
	constructor(options, treedux) {
		this.treedux = treedux;
		this.keyPath = options.keyPath;
		this.mutators = options.mutators;
	}
	static create(options, treedux) {
		const cache = treedux[NODE_CACHE];
		const existing = cache.get(options.keyPath);
		if (existing) return existing;
		const node = new StateNode(options, treedux).createProxy();
		cache.set(options.keyPath, node);
		return node;
	}
	get() {
		const keys = [...this.keyPath];
		let value = this.treedux.getState();
		while (keys.length > 0) {
			const key = keys.shift();
			if (Objects.isObject(value) && value[key] !== void 0) value = value[key];
			else {
				this.lastKnownValue = void 0;
				return this.lastKnownValue;
			}
		}
		this.lastKnownValue = value;
		return this.lastKnownValue;
	}
	set(value) {
		return Action.create({
			type: "__SET_BY_KEY_PATH__",
			payload: {
				keyPath: this.keyPath,
				value
			}
		}, this.treedux);
	}
	subscribe(callback) {
		let currentValue = this.get();
		return this.treedux.subscribe(() => {
			const newValue = this.get();
			if (equal(newValue, currentValue)) return;
			currentValue = newValue;
			callback(currentValue);
		});
	}
	byKey(key) {
		if (!key) throw `Key must be provided to byKey method.`;
		return StateNode.create({
			keyPath: this.keyPath.concat([key.toString()]),
			mutators: this.mutators
		}, this.treedux);
	}
	delete() {
		return Action.create({
			type: "__DELETE_BY_KEY_PATH__",
			payload: { keyPath: this.keyPath }
		}, this.treedux);
	}
	toReadOnly() {
		return ReadOnlyStateNode.create({ keyPath: this.keyPath }, this.treedux);
	}
	createProxy() {
		return new Proxy(this, {
			get(self, property) {
				if (typeof property !== "string") return null;
				const mutatorMethod = self.getMutatorMethod(property);
				if (mutatorMethod) return mutatorMethod;
				if (typeof self[property] === "function") return self[property].bind(self);
				return StateNode.create({
					keyPath: self.keyPath.concat(property),
					mutators: self.mutators && self.mutators[property] ? self.mutators[property] : {}
				}, self.treedux);
			},
			ownKeys() {
				return [];
			},
			getOwnPropertyDescriptor() {}
		});
	}
	getMutatorMethod(methodName) {
		if (!this.mutators || !this.mutators.hasOwnProperty(methodName) || typeof this.mutators[methodName] !== "function") return null;
		const mutatorCreator = this.mutators[methodName];
		const mutator = mutatorCreator(this.treedux);
		return mutator.getAction.bind(mutator);
	}
};
//#endregion
//#region src/data/data-store.ts
var DataStore = class DataStore {
	KEY;
	initialState;
	mutators;
	treedux;
	constructor(key, options) {
		this.KEY = key;
		this.initialState = options.initialState;
		this.mutators = options.mutators;
	}
	static create(key, options) {
		return new DataStore(key, options);
	}
	get state() {
		const options = {
			keyPath: [this.KEY],
			mutators: this.mutators
		};
		return StateNode.create(options, this.treedux);
	}
	setTreedux(treedux) {
		this.treedux = treedux;
		return this;
	}
	getInitialState() {
		return this.initialState;
	}
	getReducers() {
		return this.hydrateReducersFromMutators({}, this.mutators);
	}
	hydrateReducersFromMutators(reducerMap, mutators) {
		for (const key in mutators) {
			const mutatorCreator = mutators[key];
			if (typeof mutatorCreator === "object") this.hydrateReducersFromMutators(reducerMap, mutatorCreator);
			else {
				const mutator = mutatorCreator(this.treedux);
				if (reducerMap[mutator.getType()]) throw `Cannot add reducer. Action type already registered: ${key}`;
				reducerMap[mutator.getType()] = (...args) => {
					return mutator.reduce.call(mutator, ...args);
				};
			}
		}
		return reducerMap;
	}
};
//#endregion
//#region src/data/abstract-mutator.ts
var AbstractMutator = class {
	treedux;
	constructor(treedux) {
		this.treedux = treedux;
	}
};
//#endregion
export { AbstractMutator, Action, DataStore, DefaultActionEnum, StateNode, Treedux };
