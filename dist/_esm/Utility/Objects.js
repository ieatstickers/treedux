"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Objects = void 0;
class Objects {
  static isObject(value) {
    return typeof value === "object" && value !== null;
  }
  static setByKeyPath(keyPath, value, target) {
    // Make a copy of the keyPath array to avoid modifying the original array.
    const path = [...keyPath];

    // Create a deep copy of the object.
    const newObject = this.deepCopy(target);

    // Initialize the current object as the deep copy of the object passed to the function.
    let currentObj = newObject;

    // Iterate through the keys in the path.
    while (path.length > 0) {
      const key = path.shift();

      // If we're at the last key in the path, set the value and exit the loop.
      if (path.length === 0) {
        if (value === undefined) {
          delete currentObj[key];
        } else {
          currentObj[key] = value;
        }
        break;
      }

      // If the current object doesn't have the key, create an empty object (unless we are trying to delete a key by setting it to undefined)
      if (!currentObj[key]) {
        if (typeof value == "undefined") return newObject;
        currentObj[key] = {};
      }

      // Move the reference to the nested object.
      currentObj = currentObj[key];
    }

    // Return the modified deep copy.
    return newObject;
  }
  static deepCopy(object) {
    // If the object is not an object or null, return it directly.
    if (typeof object !== "object" || object === null) {
      return object;
    }

    // Initialize the result as an array if the input object is an array, otherwise as an object.
    const result = Array.isArray(object) ? [] : {};

    // Iterate through the keys of the input object.
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        // Recursively call deepCopy to copy the nested properties.
        result[key] = this.deepCopy(object[key]);
      }
    }

    // Return the cloned object.
    return result;
  }
}
exports.Objects = Objects;