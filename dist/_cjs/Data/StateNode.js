"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StateNode = void 0;
var _DefaultActionEnum = require("../Enum/DefaultActionEnum");
var _Objects = require("../Utility/Objects");
var _Action = require("./Action");
var _ReadOnlyStateNode = require("./ReadOnlyStateNode");
class StateNode {
  keyPath = [];
  constructor(options, treedux) {
    this.treedux = treedux;
    this.keyPath = options.keyPath;
    this.mutators = options.mutators;
  }
  static create(options, treedux) {
    return new StateNode(options, treedux).createProxy();
  }
  get() {
    const keys = [...this.keyPath];
    let value = this.treedux.getState();
    while (keys.length > 0) {
      // Get the next key
      const key = keys.shift();

      // If there is a value for the key, use that
      if (_Objects.Objects.isObject(value) && value[key] !== undefined) {
        value = value[key];
      } else {
        this.lastKnownValue = undefined;
        return this.lastKnownValue;
      }
    }
    this.lastKnownValue = value;
    return this.lastKnownValue;
  }
  set(value) {
    return _Action.Action.create({
      type: _DefaultActionEnum.DefaultActionEnum.SET_BY_KEY_PATH,
      payload: {
        keyPath: this.keyPath,
        value: value
      }
    }, this.treedux);
  }
  subscribe(callback) {
    let currentValue = this.lastKnownValue;
    return this.treedux.subscribe(() => {
      const newValue = this.get();
      if (JSON.stringify(newValue) === JSON.stringify(currentValue)) return;
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
    return _Action.Action.create({
      type: _DefaultActionEnum.DefaultActionEnum.DELETE_BY_KEY_PATH,
      payload: {
        keyPath: this.keyPath
      }
    }, this.treedux);
  }
  toReadOnly() {
    return _ReadOnlyStateNode.ReadOnlyStateNode.create({
      keyPath: this.keyPath
    }, this.treedux);
  }
  createProxy() {
    return new Proxy(this, {
      get(self, property) {
        if (typeof property !== "string") return null;
        const mutatorMethod = self.getMutatorMethod(property);

        // If mutator method exists, return it
        if (mutatorMethod) return mutatorMethod;

        // If property is a default method, return it
        if (typeof self[property] === "function") return self[property].bind(self);

        // Default to returning a new StateNode
        return StateNode.create({
          keyPath: self.keyPath.concat(property),
          mutators: self.mutators && self.mutators[property] ? self.mutators[property] : {}
        }, self.treedux);
      }
    });
  }
  getMutatorMethod(methodName) {
    // If mutator method doesn't exist, return null
    if (!this.mutators || !this.mutators.hasOwnProperty(methodName) || typeof this.mutators[methodName] !== "function") return null;
    const mutatorCreator = this.mutators[methodName];
    const mutator = mutatorCreator(this.treedux);
    return mutator.getAction.bind(mutator);
  }
}
exports.StateNode = StateNode;