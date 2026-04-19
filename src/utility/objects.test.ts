import { describe, it, expect } from "vitest";
import { Objects } from "./objects";

describe("Objects", () => {

  describe("setByKeyPath", () => {

    it("ignores inherited enumerable properties when deep-copying the target", () => {
      const proto = { inherited: "from-prototype" };
      const target: { own: { value: number } } = Object.create(proto);
      target.own = { value: 1 };

      const result = Objects.setByKeyPath([ "own", "value" ], 2, target);

      expect(result).toEqual({ own: { value: 2 } });
      expect(Object.prototype.hasOwnProperty.call(result, "inherited")).toBe(false);
    });

  });

});