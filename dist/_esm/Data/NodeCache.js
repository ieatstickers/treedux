"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeCache = void 0;
class NodeCache {
  cache = new Map();
  registry = new FinalizationRegistry(key => {
    this.cache.delete(key);
  });
  get(keyPath) {
    var _this$cache$get;
    return ((_this$cache$get = this.cache.get(this.toKey(keyPath))) === null || _this$cache$get === void 0 ? void 0 : _this$cache$get.deref()) ?? null;
  }
  set(keyPath, value) {
    const key = this.toKey(keyPath);
    this.cache.set(key, new WeakRef(value));
    this.registry.register(value, key);
  }
  toKey(keyPath) {
    return keyPath.join("\x00");
  }
}
exports.NodeCache = NodeCache;