import { Treedux } from "../Treedux";
import { Objects } from "../Utility/Objects";
import { ObjectKeys } from "../Type/ObjectKeys";
import { ObjectPropertyType } from "../Type/ObjectPropertyType";
import { ReadOnlyRecursiveStateNode } from "../Type/ReadOnlyRecursiveStateNode";
import { ReadOnlyStateNodeInterface } from "../Type/ReadOnlyStateNodeInterface";

type ReadOnlyStateNodeOptions = {
  keyPath: Array<string>
}

export class ReadOnlyStateNode<StateNodeType, StateInterface> implements ReadOnlyStateNodeInterface<StateNodeType>
{
  private readonly treedux: Treedux;
  private lastKnownValue: StateNodeType;
  private readonly keyPath: Array<string> = [];
  
  protected constructor(
    options: ReadOnlyStateNodeOptions,
    treedux: Treedux
  )
  {
    this.treedux = treedux;
    this.keyPath = options.keyPath;
  }
  
  public static create<StateNodeType, StateInterface>(options: ReadOnlyStateNodeOptions, treedux: Treedux): ReadOnlyRecursiveStateNode<StateNodeType, StateInterface>
  {
    return (new ReadOnlyStateNode<StateNodeType, StateInterface>(options, treedux)).createProxy();
  }
  
  public get(): StateNodeType
  {
    const keys = [ ...this.keyPath ];
    let value = this.treedux.getState();
    
    while (keys.length > 0)
    {
      // Get the next key
      const key = keys.shift();
      
      // If there is a value for the key, use that
      if (Objects.isObject(value))
      {
        value = value[key];
      }
      else
      {
        this.lastKnownValue = undefined;
        return this.lastKnownValue;
      }
    }
    
    this.lastKnownValue = value;
    return this.lastKnownValue!;
  }
  
  public subscribe(callback: (data: StateNodeType) => void): () => void
  {
    let currentValue = this.lastKnownValue;
    
    return this.treedux.subscribe(() => {
      const newValue = this.get();
      if (JSON.stringify(newValue) === JSON.stringify(currentValue)) return;
      currentValue = newValue;
      callback(currentValue);
    });
  }
  
  public byKey<K extends ObjectKeys<StateNodeType>>(key: K): ReadOnlyRecursiveStateNode<ObjectPropertyType<StateNodeType, K>, StateInterface>
  {
    if (!key) throw `Key must be provided to byKey method.`;
    
    return ReadOnlyStateNode.create(
      {
        keyPath: this.keyPath.concat([ key.toString() ])
      },
      this.treedux
    ) as unknown as ReadOnlyRecursiveStateNode<ObjectPropertyType<StateNodeType, K>, StateInterface>;
  }
  
  private createProxy(): ReadOnlyRecursiveStateNode<StateNodeType, StateInterface>
  {
    return new Proxy(this, {
      get(self, property: string | symbol)
      {
        if (typeof property !== "string") return null;
        
        // If property is a default method, return it
        if (typeof self[property] === "function") return self[property].bind(self);
        
        // Default to returning a new StateNode
        return ReadOnlyStateNode.create(
          {
            keyPath: self.keyPath.concat(property)
          },
          self.treedux
        );
      }
    }) as unknown as ReadOnlyRecursiveStateNode<StateNodeType, StateInterface>;
  }
  
}
