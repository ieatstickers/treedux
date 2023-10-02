import { DefaultActionEnum } from "../Enum/DefaultActionEnum";
import { Treedux } from "../Treedux";
import { Objects } from "../Utility/Objects";
import { Action } from "./Action";
import { RecursiveStateNode } from "../Type/RecursiveStateNode";
import { MutatorCreators } from "../Type/MutatorCreators";
import { StateNodeInterface } from "../Type/StateNodeInterface";
import { MutatorInterface } from "./MutatorInterface";
import { MutatorMethods } from "../Type/MutatorMethods";
const reactPackageName: string = 'react';
let React: typeof import("react");

try
{
  React = require(reactPackageName);
}
catch (e)
{
  React = null;
}

type StateNodeOptions<T, StateInterface> = {
  keyPath: Array<string>,
  mutators?: MutatorCreators<T, StateInterface>
}

export class StateNode<StateNodeType, StateInterface, Options extends StateNodeOptions<StateNodeType, StateInterface> = StateNodeOptions<StateNodeType, StateInterface>> implements StateNodeInterface<StateNodeType, MutatorMethods<StateInterface, Options['mutators']>>
{
  private readonly treedux: Treedux;
  private lastKnownValue: StateNodeType;
  private readonly keyPath: Array<string> = [];
  private readonly mutators: Options['mutators'];

  protected constructor(
    options: StateNodeOptions<StateNodeType, StateInterface>,
    treedux: Treedux
  )
  {
    this.treedux = treedux;
    this.keyPath = options.keyPath;
    this.mutators = options.mutators;
  }

  public static create<StateNodeType, StateInterface, Options extends StateNodeOptions<StateNodeType, StateInterface> = StateNodeOptions<StateNodeType, StateInterface>>(options: StateNodeOptions<StateNodeType, StateInterface>, treedux: Treedux): RecursiveStateNode<StateNodeType, StateInterface, Options['mutators']>
  {
    return (new StateNode<StateNodeType, StateInterface, Options>(options, treedux)).createProxy();
  }

  public get(): StateNodeType
  {
    const keys = [ ...this.keyPath ];
    const state = this.treedux.getState();

    if (keys.length === 0) return state;

    let value = state;

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
        this.lastKnownValue = null;
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
    let currentValue = this.lastKnownValue;

    return this.treedux.subscribe(() => {
      const newValue = this.get();
      if (JSON.stringify(newValue) === JSON.stringify(currentValue)) return;
      currentValue = newValue;
      callback(currentValue);
    })
  }

  public use(): { value: StateNodeType, set: (value: StateNodeType) => Action<{ keyPath: Array<string>, value: StateNodeType }> } & MutatorMethods<StateInterface, Options['mutators']>
  {
    if (!React) throw "Cannot use StateNode.use() - React peer dependency not installed.";

    const [ value, setValue ] = React.useState(this.get());
    React.useEffect(() => this.subscribe(setValue));

    return {
      value: value,
      set: this.set.bind(this),
      ...this.getMutatorMethods()
    };
  }

  private createProxy(): RecursiveStateNode<StateNodeType, StateInterface, Options['mutators']>
  {
    return new Proxy(this, {
      get(self, property: string | symbol)
      {
        if (typeof property !== 'string') return null;

        const mutatorMethod = self.getMutatorMethod(property);

        // If mutator method exists, return it
        if (mutatorMethod) return mutatorMethod;

        // If property is a default method, return it
        if (typeof self[property] === 'function') return self[property].bind(self);

        // Default to returning a new StateNode
        return StateNode.create(
          {
            keyPath: self.keyPath.concat(property),
            mutators: self.mutators && self.mutators[property] ? self.mutators[property] : {}
          },
          self.treedux
        );
      },
    }) as unknown as RecursiveStateNode<StateNodeType, StateInterface, Options['mutators']>
  }

  private getMutatorMethod(methodName: string): MutatorInterface<any>['getAction']
  {
    // If mutator method doesn't exist, return null
    if (!this.mutators || !this.mutators[methodName] || typeof this.mutators[methodName] !== 'function') return null;
    const mutatorCreator = this.mutators[methodName];
    const mutator = mutatorCreator(this.treedux);
    return mutator.getAction.bind(mutator);
  }

  private getMutatorMethods(): MutatorMethods<StateInterface, Options['mutators']>
  {
    const mutatorCreators = this.mutators || {};
    const mutatorMethods = {} as MutatorMethods<StateInterface, Options['mutators']>;

    for (const methodName in mutatorCreators)
    {
      if (typeof mutatorCreators[methodName] !== 'function') continue;
      mutatorMethods[methodName] = this.getMutatorMethod(methodName);
    }

    return mutatorMethods;
  }
}
