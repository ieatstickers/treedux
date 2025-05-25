"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataStore = void 0;
var _StateNode = require("./StateNode");
class DataStore {
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
    return _StateNode.StateNode.create(options, this.treedux);
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
      if (typeof mutatorCreator === "object") {
        this.hydrateReducersFromMutators(reducerMap, mutatorCreator);
      } else {
        const mutator = mutatorCreator(this.treedux);
        if (reducerMap[mutator.getType()]) throw `Cannot add reducer. Action type already registered: ${key}`;
        reducerMap[mutator.getType()] = (...args) => {
          return mutator.reduce.call(mutator, ...args);
        };
      }
    }
    return reducerMap;
  }
}
exports.DataStore = DataStore;