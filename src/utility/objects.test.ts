import { describe, it, expect } from "vitest";
import { Objects } from "./objects";

describe("Objects", () => {

  describe("setByKeyPath", () => {

    it("ignores inherited enumerable properties when copying the target", () => {
      const proto = { inherited: "from-prototype" };
      const target: { own: { value: number } } = Object.create(proto);
      target.own = { value: 1 };

      const result = Objects.setByKeyPath([ "own", "value" ], 2, target);

      expect(result).toEqual({ own: { value: 2 } });
      expect(Object.prototype.hasOwnProperty.call(result, "inherited")).toBe(false);
    });

    it("preserves references to sibling branches that were not changed", () => {
      const target = {
        user: { email: "old@example.com", profile: { name: "Mike" } },
        contacts: { list: [ "alice", "bob" ] },
        settings: { theme: "dark" }
      };

      const result = Objects.setByKeyPath([ "user", "email" ], "new@example.com", target);

      expect(result.contacts).toBe(target.contacts);
      expect(result.contacts.list).toBe(target.contacts.list);
      expect(result.settings).toBe(target.settings);
      expect(result.user.profile).toBe(target.user.profile);
    });

    it("creates new references for every node along the changed path", () => {
      const target = {
        user: { email: "old@example.com", profile: { name: "Mike" } }
      };

      const result = Objects.setByKeyPath([ "user", "email" ], "new@example.com", target);

      expect(result).not.toBe(target);
      expect(result.user).not.toBe(target.user);
      expect(result.user.email).toBe("new@example.com");
    });

    it("sets a value at an existing leaf", () => {
      const target = { a: { b: { c: 1 } } };

      const result = Objects.setByKeyPath([ "a", "b", "c" ], 42, target);

      expect(result).toEqual({ a: { b: { c: 42 } } });
    });

    it("creates intermediate objects when keys along the path do not exist", () => {
      const target: { a?: { b?: { c?: number } } } = {};

      const result = Objects.setByKeyPath([ "a", "b", "c" ], 1, target);

      expect(result).toEqual({ a: { b: { c: 1 } } });
    });

    it("deletes a leaf when the value is undefined", () => {
      const target = { a: { b: 1, c: 2 } };

      const result = Objects.setByKeyPath([ "a", "b" ], undefined, target);

      expect(result).toEqual({ a: { c: 2 } });
      expect(Object.prototype.hasOwnProperty.call(result.a, "b")).toBe(false);
    });

    it("is a no-op when deleting a path that does not exist", () => {
      const target = { a: { b: 1 } };

      const result = Objects.setByKeyPath([ "x", "y", "z" ], undefined, target);

      expect(result).toEqual({ a: { b: 1 } });
    });

    it("preserves arrays as arrays when they are part of the changed path", () => {
      const target = { items: [ "a", "b", "c" ] };

      const result = Objects.setByKeyPath([ "items", "1" ], "B", target);

      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items).toEqual([ "a", "B", "c" ]);
    });

    it("returns the original target unchanged when keyPath is empty", () => {
      const target = { a: 1 };

      const result = Objects.setByKeyPath([], "anything", target);

      expect(result).toBe(target);
    });

    it("shallow-copies the root when the target itself is an array", () => {
      const target = [ "a", "b", "c" ];

      const result = Objects.setByKeyPath([ "1" ], "B", target);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([ "a", "B", "c" ]);
      expect(result).not.toBe(target);
    });

  });

  describe("isObject", () => {

    it("returns true for plain objects", () => {
      expect(Objects.isObject({})).toBe(true);
      expect(Objects.isObject({ a: 1 })).toBe(true);
    });

    it("returns true for arrays", () => {
      expect(Objects.isObject([])).toBe(true);
    });

    it("returns false for null", () => {
      expect(Objects.isObject(null)).toBe(false);
    });

    it("returns false for primitives", () => {
      expect(Objects.isObject(1)).toBe(false);
      expect(Objects.isObject("a")).toBe(false);
      expect(Objects.isObject(undefined)).toBe(false);
      expect(Objects.isObject(true)).toBe(false);
    });

  });

});