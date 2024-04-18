import { Objects } from "./Objects";

describe("Objects", () => {
  
  describe("isObject", () => {
    
    it("returns true for an object", () => {
      expect(Objects.isObject({})).toBe(true);
    });
    
    it("returns false for null", () => {
      expect(Objects.isObject(null)).toBe(false);
    });
    
  })
  
  describe("setByKeyPath", () => {
    
    it("throws an error if the keyPath is empty", () => {
      expect(() => Objects.setByKeyPath([], 1, {})).toThrowError("Key path should not be empty.");
    });
    
    it("sets a value at the end of a key path", () => {
      const obj = {a: {b: {c: 1}}};
      const newObj = Objects.setByKeyPath(["a", "b", "c"], 2, obj);
      expect(newObj).toEqual({a: {b: {c: 2}}});
    });
    
    it("deletes a value at the end of a key path if the value is undefined", () => {
      const obj = {a: {b: {c: 1}}};
      const newObj = Objects.setByKeyPath(["a", "b", "c"], undefined, obj);
      expect(newObj).toEqual({a: {b: {}}});
    });
    
    it("returns a new object", () => {
      const obj = {a: {b: {c: 1}}};
      const newObj = Objects.setByKeyPath(["a", "b", "c"], 2, obj);
      expect(newObj).not.toBe(obj);
    });
    
    it("does not modify the original object", () => {
      const obj = {a: {b: {c: 1}}};
      Objects.setByKeyPath(["a", "b", "c"], 2, obj);
      expect(obj).toEqual({a: {b: {c: 1}}});
    });
    
    it("creates nested objects if they don't exist", () => {
      const obj = {a: {}};
      const newObj = Objects.setByKeyPath(["a", "b", "c"], 1, obj);
      expect(newObj).toEqual({a: {b: {c: 1}}});
    });
    
    it("doesn't create an empty path in the object if it doesn't already exist and the final value is undefined", () => {
      const obj = {a: {b: {c: 1}}};
      const newObj = Objects.setByKeyPath(["a", "b", "d", "e"], undefined, obj);
      expect(newObj).toEqual({a: {b: {c: 1}}});
    });
    
  })
  
  describe("deepCopy", () => {
    
    it("returns a new object", () => {
      const obj = { a: { b: { c: 1 } } };
      const newObj = Objects['deepCopy'](obj);
      expect(newObj).not.toBe(obj);
    });
    
    it("returns a deep copy of the object", () => {
      const obj = { a: { b: { c: 1, d: [ { test: true } ] } } };
      const newObj = Objects['deepCopy'](obj);
      expect(newObj).toEqual(obj);
      expect(newObj).not.toBe(obj);
      expect(newObj.a).not.toBe(obj.a);
      expect(newObj.a.b).not.toBe(obj.a.b);
      expect(newObj.a.b.d).not.toBe(obj.a.b.d);
      expect(newObj.a.b.d[0]).not.toBe(obj.a.b.d[0]);
    });
  });

});
