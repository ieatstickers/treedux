export class Objects
{
  public static isObject(value: any): value is object
  {
    return typeof value === "object" && value !== null;
  }

  public static setByKeyPath<V, T>(keyPath: Array<string>, value: V, target: T): T
  {
    // No path to follow — nothing to change, return the original reference.
    if (keyPath.length === 0) return target;

    // Make a copy of the keyPath array to avoid modifying the original array.
    const path = [ ...keyPath ];

    // Shallow-copy the root so siblings retain their original references.
    const newObject: any = Array.isArray(target) ? [ ...target ] : { ...target };

    // Initialize the current object as the shallow copy of the object passed to the function.
    let currentObj: any = newObject;

    // Iterate through the keys in the path.
    while (path.length > 0)
    {
      const key = path.shift();

      // If we're at the last key in the path, set the value and exit the loop.
      if (path.length === 0)
      {
        if (value === undefined)
        {
          delete currentObj[key];
        }
        else
        {
          currentObj[key] = value;
        }

        break;
      }

      // If the current object doesn't have the key, create an empty object (unless we are trying to delete a key by setting it to undefined)
      if (!currentObj[key])
      {
        if (typeof value == "undefined") return newObject;

        currentObj[key] = {};
      }
      else
      {
        // Shallow-copy the child onto its parent before descending so only nodes along the path get new references.
        currentObj[key] = Array.isArray(currentObj[key]) ? [ ...currentObj[key] ] : { ...currentObj[key] };
      }

      // Move the reference to the nested object.
      currentObj = currentObj[key];
    }

    // Return the modified shallow copy.
    return newObject;
  }
}
