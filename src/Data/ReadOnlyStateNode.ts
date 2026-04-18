import { READ_ONLY_NODE_CACHE, Treedux } from "../Treedux";
import { Objects } from "../utility/objects";
import { ObjectKeys } from "../Type/ObjectKeys";
import { ObjectPropertyType } from "../Type/ObjectPropertyType";
import { ReadOnlyRecursiveStateNode } from "../Type/ReadOnlyRecursiveStateNode";
import { ReadOnlyStateNodeInterface } from "../Type/ReadOnlyStateNodeInterface";
import equal from "fast-deep-equal";

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
    const cache = treedux[READ_ONLY_NODE_CACHE];

    const existing = cache.get<ReadOnlyRecursiveStateNode<StateNodeType, StateInterface>>(options.keyPath);
    if (existing) return existing;

    const node = (new ReadOnlyStateNode<StateNodeType, StateInterface>(options, treedux)).createProxy();
    cache.set(options.keyPath, node);
    return node;
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
      if (equal(newValue, currentValue)) return;
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
      },
      // ownKeys and getOwnPropertyDescriptor here to prevent vitest hitting infinite loop when inspecting properties recursively
      ownKeys()
      {
        return [];
      },
      getOwnPropertyDescriptor()
      {
        return undefined;
      }
    }) as unknown as ReadOnlyRecursiveStateNode<StateNodeType, StateInterface>;
  }

}
