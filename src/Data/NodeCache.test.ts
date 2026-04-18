import { NodeCache } from "./NodeCache";

describe("NodeCache", () => {

  it("returns null when a key has never been set", () => {
    const cache = new NodeCache();
    expect(cache.get([ "missing" ])).toBeNull();
  });

  it("returns the same object after set/get", () => {
    const cache = new NodeCache();
    const value = { id: 1 };

    cache.set([ "a", "b" ], value);

    expect(cache.get([ "a", "b" ])).toBe(value);
  });

  it("distinguishes different key paths", () => {
    const cache = new NodeCache();
    const a = { id: "a" };
    const b = { id: "b" };

    cache.set([ "x" ], a);
    cache.set([ "y" ], b);

    expect(cache.get([ "x" ])).toBe(a);
    expect(cache.get([ "y" ])).toBe(b);
  });

  it("overrides a value when set is called again with the same path", () => {
    const cache = new NodeCache();
    const first = { v: 1 };
    const second = { v: 2 };

    cache.set([ "k" ], first);
    cache.set([ "k" ], second);

    expect(cache.get([ "k" ])).toBe(second);
  });

  it("uses the full path rather than a flattened key", () => {
    const cache = new NodeCache();
    const value = { v: "target" };

    cache.set([ "a", "b" ], value);

    expect(cache.get([ "a", "b" ])).toBe(value);
    expect(cache.get([ "ab" ])).toBeNull();
    expect(cache.get([ "a" ])).toBeNull();
  });

  it("evicts the entry after the value is garbage collected", async () => {
    const cache = new NodeCache();

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
