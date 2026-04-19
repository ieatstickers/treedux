import { describe, it, expect, vi } from "vitest";
import { GcNodeCache } from "./gc-node-cache";

describe("GcNodeCache", () => {

  describe("isSupported", () => {

    it("returns true when WeakRef and FinalizationRegistry are available", () => {
      expect(GcNodeCache.isSupported()).toBe(true);
    });

    it("returns false when WeakRef is missing", () => {
      vi.stubGlobal("WeakRef", undefined);
      expect(GcNodeCache.isSupported()).toBe(false);
      vi.unstubAllGlobals();
    });

    it("returns false when FinalizationRegistry is missing", () => {
      vi.stubGlobal("FinalizationRegistry", undefined);
      expect(GcNodeCache.isSupported()).toBe(false);
      vi.unstubAllGlobals();
    });

  });

  it("returns null when a key has never been set", () => {
    const cache = new GcNodeCache();
    expect(cache.get([ "missing" ])).toBeNull();
  });

  it("returns the same object after set/get", () => {
    const cache = new GcNodeCache();
    const value = { id: 1 };

    cache.set([ "a", "b" ], value);

    expect(cache.get([ "a", "b" ])).toBe(value);
  });

  it("distinguishes different key paths", () => {
    const cache = new GcNodeCache();
    const a = { id: "a" };
    const b = { id: "b" };

    cache.set([ "x" ], a);
    cache.set([ "y" ], b);

    expect(cache.get([ "x" ])).toBe(a);
    expect(cache.get([ "y" ])).toBe(b);
  });

  it("overrides a value when set is called again with the same path", () => {
    const cache = new GcNodeCache();
    const first = { v: 1 };
    const second = { v: 2 };

    cache.set([ "k" ], first);
    cache.set([ "k" ], second);

    expect(cache.get([ "k" ])).toBe(second);
  });

  it("uses the full path rather than a flattened key", () => {
    const cache = new GcNodeCache();
    const value = { v: "target" };

    cache.set([ "a", "b" ], value);

    expect(cache.get([ "a", "b" ])).toBe(value);
    expect(cache.get([ "ab" ])).toBeNull();
    expect(cache.get([ "a" ])).toBeNull();
  });

  it("evicts the entry after the value is garbage collected", async () => {
    const cache = new GcNodeCache();

    cache.set([ "a" ], {});

    // Multiple passes: force GC, then drain queued finalizer callbacks.
    for (let i = 0; i < 5; i++)
    {
      global.gc!(); // force a GC pass
      await new Promise(resolve => setImmediate(resolve)); // let Node run the finalizer queue
    }

    expect(cache.get([ "a" ])).toBeNull();
  });

});
