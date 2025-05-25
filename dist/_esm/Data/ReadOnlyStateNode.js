"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReadOnlyStateNode = void 0;
var _Objects = require("../Utility/Objects");
class ReadOnlyStateNode {
  keyPath = [];
  constructor(options, treedux) {
    this.treedux = treedux;
    this.keyPath = options.keyPath;
  }
  static create(options, treedux) {
    return new ReadOnlyStateNode(options, treedux).createProxy();
  }
  get() {
    const keys = [...this.keyPath];
    let value = this.treedux.getState();
    while (keys.length > 0) {
      // Get the next key
      const key = keys.shift();

      // If there is a value for the key, use that
      if (_Objects.Objects.isObject(value)) {
        value = value[key];
      } else {
        this.lastKnownValue = undefined;
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
      if (JSON.stringify(newValue) === JSON.stringify(currentValue)) return;
      currentValue = newValue;
      callback(currentValue);
    });
  }
  byKey(key) {
    if (!key) throw `Key must be provided to byKey method.`;
    return ReadOnlyStateNode.create({
      keyPath: this.keyPath.concat([key.toString()])
    }, this.treedux);
  }
  createProxy() {
    return new Proxy(this, {
      get(self, property) {
        if (typeof property !== "string") return null;

        // If property is a default method, return it
        if (typeof self[property] === "function") return self[property].bind(self);

        // Default to returning a new StateNode
        return ReadOnlyStateNode.create({
          keyPath: self.keyPath.concat(property)
        }, self.treedux);
      }
    });
  }
}
exports.ReadOnlyStateNode = ReadOnlyStateNode;