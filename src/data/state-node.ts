import { DefaultActionEnum } from "../Enum/default-action-enum";
import { NODE_CACHE, Treedux } from "../treeduxx";
import { Objects } from "../utility/objects";
import { Action } from "./action";
import { RecursiveStateNode } from "../Type/RecursiveStateNode";
import { MutatorCreators } from "../Type/MutatorCreators";
import { StateNodeInterface } from "../Type/StateNodeInterface";
import { MutatorInterface } from "./mutator-interface";
import { ObjectKeys } from "../Type/ObjectKeys";
import { ObjectPropertyType } from "../Type/ObjectPropertyType";
import { ReadOnlyRecursiveStateNode } from "../Type/ReadOnlyRecursiveStateNode";
import { ReadOnlyStateNode } from "./read-only-state-node";
import equal from "fast-deep-equal";

type StateNodeOptions<T, StateInterface> = {
  keyPath: Array<string>,
  mutators?: MutatorCreators<T, StateInterface>
}

export class StateNode<StateNodeType, ParentStateNodeType, StateInterface, Options extends StateNodeOptions<StateNodeType, StateInterface> = StateNodeOptions<StateNodeType, StateInterface>> implements StateNodeInterface<StateNodeType, StateInterface>
{
  private readonly treedux: Treedux;
  private lastKnownValue: StateNodeType;
  private readonly keyPath: Array<string> = [];
  private readonly mutators: Options["mutators"];

  protected constructor(
    options: StateNodeOptions<StateNodeType, StateInterface>,
    treedux: Treedux
  )
  {
    this.treedux = treedux;
    this.keyPath = options.keyPath;
    this.mutators = options.mutators;
  }

  public static create<StateNodeType, ParentStateNodeType, StateInterface, Options extends StateNodeOptions<StateNodeType, StateInterface> = StateNodeOptions<StateNodeType, StateInterface>>(options: StateNodeOptions<StateNodeType, StateInterface>, treedux: Treedux): RecursiveStateNode<StateNodeType, ParentStateNodeType, StateInterface, Options["mutators"]>
  {
    const cache = treedux[NODE_CACHE];

    const existing = cache.get<RecursiveStateNode<StateNodeType, ParentStateNodeType, StateInterface, Options["mutators"]>>(options.keyPath);
    if (existing) return existing;

    const node = (new StateNode<StateNodeType, ParentStateNodeType, StateInterface, Options>(options, treedux)).createProxy();
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
      if (Objects.isObject(value) && value[key] !== undefined)
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
    return this.lastKnownValue;
  }

  public set(value: StateNodeType): Action<{ keyPath: Array<string>, value: StateNodeType }>
  {
    return Action.create(
      {
        type: DefaultActionEnum.SET_BY_KEY_PATH,
        payload: { keyPath: this.keyPath, value: value }
      },
      this.treedux
    );
  }

  public subscribe(callback: (data: StateNodeType) => void): () => void
  {
    let currentValue = this.get();

    return this.treedux.subscribe(() => {
      const newValue = this.get();
      if (equal(newValue, currentValue)) return;
      currentValue = newValue;
      callback(currentValue);
    });
  }

  public byKey<K extends ObjectKeys<StateNodeType>>(key: K): RecursiveStateNode<
    ObjectPropertyType<StateNodeType, K>, StateNodeType, StateInterface,
    K extends keyof Options["mutators"] ? Options["mutators"][K] extends MutatorCreators<ObjectPropertyType<StateNodeType, K>,
      StateInterface
    > ? Options["mutators"][K] : {} : {}
  >
  {
    if (!key) throw `Key must be provided to byKey method.`;

    return StateNode.create(
      {
        keyPath: this.keyPath.concat([ key.toString() ]),
        mutators: this.mutators
      },
      this.treedux
    ) as unknown as RecursiveStateNode<
      ObjectPropertyType<StateNodeType, K>,
      StateNodeType,
      StateInterface,
      K extends keyof Options["mutators"] ? Options["mutators"][K] extends MutatorCreators<ObjectPropertyType<StateNodeType, K>, StateInterface> ? Options["mutators"][K] : {} : {}
    >;
  }

  public delete(): Action<{ keyPath: Array<string> }>
  {
    return Action.create(
      {
        type: DefaultActionEnum.DELETE_BY_KEY_PATH,
        payload: { keyPath: this.keyPath }
      },
      this.treedux
    );
  }

  public toReadOnly(): ReadOnlyRecursiveStateNode<StateNodeType, StateInterface>
  {
    return ReadOnlyStateNode.create({ keyPath: this.keyPath }, this.treedux) as unknown as ReadOnlyRecursiveStateNode<StateNodeType, StateInterface>;
  }

  private createProxy(): RecursiveStateNode<StateNodeType, ParentStateNodeType, StateInterface, Options["mutators"]>
  {
    return new Proxy(this, {
      get(self, property: string | symbol)
      {
        if (typeof property !== "string") return null;

        const mutatorMethod = self.getMutatorMethod(property);

        // If mutator method exists, return it
        if (mutatorMethod) return mutatorMethod;

        // If property is a default method, return it
        if (typeof self[property] === "function") return self[property].bind(self);

        // Default to returning a new StateNode
        return StateNode.create(
          {
            keyPath: self.keyPath.concat(property),
            mutators: self.mutators && self.mutators[property] ? self.mutators[property] : {}
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
    }) as unknown as RecursiveStateNode<StateNodeType, ParentStateNodeType, StateInterface, Options["mutators"]>;
  }

  private getMutatorMethod(methodName: string): MutatorInterface<any>["getAction"]
  {
    // If mutator method doesn't exist, return null
    if (!this.mutators || !this.mutators.hasOwnProperty(methodName) || typeof this.mutators[methodName] !== "function") return null;
    const mutatorCreator = this.mutators[methodName];
    const mutator = mutatorCreator(this.treedux);
    return mutator.getAction.bind(mutator);
  }

}
