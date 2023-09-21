import { DefaultActionEnum } from "../Enum/DefaultActionEnum";
import { Treedux } from "../Treedux";
import { Objects } from "../Utility/Objects";
import { Action } from "./Action";
import { RecursiveStateNode } from "../Type/RecursiveStateNode";
import { MutatorCreators } from "../Type/MutatorCreators";
import { StateNodeInterface } from "../Type/StateNodeInterface";

type StateNodeOptions<T, StateInterface> = {
  keyPath: Array<string>,
  mutators?: MutatorCreators<T, StateInterface>
}

export class StateNode<StateNodeType, StateInterface, Options extends StateNodeOptions<StateNodeType, StateInterface> = StateNodeOptions<StateNodeType, StateInterface>> implements StateNodeInterface<StateNodeType>
{
  private readonly treedux: Treedux;
  private lastKnownValue: StateNodeType;
  private readonly keyPath: Array<string> = [];
  
  protected constructor(
    options: StateNodeOptions<StateNodeType, StateInterface>,
    treedux: Treedux
  )
  {
    this.treedux = treedux;
    this.keyPath = options.keyPath;
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
  
  public use(): { value: StateNodeType, set: (value: StateNodeType) => Action<{ keyPath: Array<string>, value: StateNodeType }> }
  {
    // TODO: Add useState hooks
    return { value: this.get(), set: this.set.bind(this) };
  }
  
  private createProxy(): RecursiveStateNode<StateNodeType, StateInterface, Options['mutators']>
  {
    return new Proxy(this, {
      get(target, property: string | symbol)
      {
        const currentValue = target.get();
        
        // If accessing a property of the data object, return a new StateNode
        if (
          typeof property === 'string'
          && Objects.isObject(currentValue)
          && property in currentValue
        )
        {
          // const value = currentValue[prop as keyof T] as T;
          
          return StateNode.create(
            {
              keyPath: target.keyPath.concat(property)
            },
            target.treedux
          );
          
        }
        // Else if accessing a method of the StateNode, bind it to the StateNode
        else if (typeof target[property] === 'function')
        {
          return target[property].bind(target);
        }
        
        // Default to returning the property (even if it doesn't exist)
        return target[property];
      },
    }) as unknown as RecursiveStateNode<StateNodeType, StateInterface, Options['mutators']>
  }
}
