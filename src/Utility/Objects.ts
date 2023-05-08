export class Objects
{
  public static isObject(value: any): value is object
  {
    return typeof value === 'object' && value !== null;
  }
  
  public static setByKeyPath<V, T>(keyPath: Array<string>, value: V, target: T): T
  {
    // Check if the keyPath is empty, and if so, throw an error.
    if (keyPath.length === 0)
    {
      throw new Error("Key path should not be empty.");
    }
    
    // Make a copy of the keyPath array to avoid modifying the original array.
    const path = [...keyPath];
    
    // Create a deep copy of the object.
    const newObject: T = this.deepCopy(target);
    
    // Initialize the current object as the deep copy of the object passed to the function.
    let currentObj: any = newObject;
    
    // Iterate through the keys in the path.
    while (path.length > 0)
    {
      const key = path.shift();
      
      // If we're at the last key in the path, set the value and exit the loop.
      if (path.length === 0)
      {
        currentObj[key] = value;
        break;
      }
      
      // If the current object doesn't have the key, create an empty object.
      if (!currentObj[key])
      {
        currentObj[key] = {};
      }
      
      // Move the reference to the nested object.
      currentObj = currentObj[key];
    }
    
    // Return the modified deep copy.
    return newObject;
  }
  
  private static deepCopy<T>(object: T): T
  {
    // If the object is not an object or null, return it directly.
    if (typeof object !== 'object' || object === null)
    {
      return object;
    }
    
    // Initialize the result as an array if the input object is an array, otherwise as an object.
    const result: any = Array.isArray(object) ? [] : {};
    
    // Iterate through the keys of the input object.
    for (const key in object)
    {
      if (Object.prototype.hasOwnProperty.call(object, key))
      {
        // Recursively call deepCopy to copy the nested properties.
        result[key] = this.deepCopy(object[key]);
      }
    }
    
    // Return the cloned object.
    return result as T;
  }
}
