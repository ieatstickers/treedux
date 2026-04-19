import { describe, it, expect } from "vitest";
import { LazyNodeCache } from "./lazy-node-cache";

describe("LazyNodeCache", () => {

  it("returns null when a key has never been set", () => {
    const cache = new LazyNodeCache();
    expect(cache.get([ "missing" ])).toBeNull();
  });

  it("returns the same object after set/get", () => {
    const cache = new LazyNodeCache();
    const value = { id: 1 };

    cache.set([ "a", "b" ], value);

    expect(cache.get([ "a", "b" ])).toBe(value);
  });

  it("distinguishes different key paths", () => {
    const cache = new LazyNodeCache();
    const a = { id: "a" };
    const b = { id: "b" };

    cache.set([ "x" ], a);
    cache.set([ "y" ], b);

    expect(cache.get([ "x" ])).toBe(a);
    expect(cache.get([ "y" ])).toBe(b);
  });

  it("overrides a value when set is called again with the same path", () => {
    const cache = new LazyNodeCache();
    const first = { v: 1 };
    const second = { v: 2 };

    cache.set([ "k" ], first);
    cache.set([ "k" ], second);

    expect(cache.get([ "k" ])).toBe(second);
  });

  it("uses the full path rather than a flattened key", () => {
    const cache = new LazyNodeCache();
    const value = { v: "target" };

    cache.set([ "a", "b" ], value);

    expect(cache.get([ "a", "b" ])).toBe(value);
    expect(cache.get([ "ab" ])).toBeNull();
    expect(cache.get([ "a" ])).toBeNull();
  });

});