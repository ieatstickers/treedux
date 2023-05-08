import { DefaultActionEnum } from "../Enum/DefaultActionEnum";
import { Treedux } from "../Treedux";
import { Objects } from "../Utility/Objects";
import { Action } from "./Action";

type StateNodeOptions<T> = {
  keyPath?: Array<string>;
  getter?: () => T;
}

type OwnKeys<T> = {
  [K in keyof T]: (T extends Record<string, any> ? K extends keyof T ? K : never : never);
}[keyof T];

type RecursiveStateNode<T> = T extends object
  ? StateNode<T> & { [K in OwnKeys<T>]: RecursiveStateNode<T[K]> }
  : StateNode<T>;

type OptionsWithGetter<T> = Extract<StateNodeOptions<T>, { getter: () => T }>;

export class StateNode<T>
{
  private readonly treedux: Treedux;
  private lastKnownValue: T;
  private readonly keyPath: Array<string> = [];
  private readonly getter: () => T;
  
  protected constructor(
    options: StateNodeOptions<T>,
    treedux: Treedux
  )
  {
    if (
      // If neither keyPath nor getter are set
      (!options.keyPath && !options.getter)
      // Or if both keyPath and getter are set
      || (options.keyPath && options.getter)
    )
    {
      throw "StateNodeOptions must contain 'keyPath' OR 'getter'"
    }
    
    this.treedux = treedux;
    if (options.keyPath) this.keyPath = options.keyPath;
    if (options.getter) this.getter = options.getter;
  }
  
  public static create<T, Options extends StateNodeOptions<T> = StateNodeOptions<T>>(options: StateNodeOptions<T>, treedux: Treedux): Options extends OptionsWithGetter<T> ? StateNode<T> : RecursiveStateNode<T>
  {
    return (new StateNode<T>(options, treedux)).createProxy();
  }
  
  public get(): T
  {
    if (this.getter)
    {
      this.lastKnownValue = this.getter();
      return this.lastKnownValue;
    }
    
    const keys = [...this.keyPath];
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
  
  public set(value: T): Action
  {
    return Action.create(
      {
        type: DefaultActionEnum.SET_BY_KEY_PATH,
        payload: {keyPath: this.keyPath, value: value}
      },
      this.treedux.dispatch.bind(this.treedux)
    );
  }
  
  public subscribe(callback: (data: T) => void): () => void
  {
    let currentValue = this.lastKnownValue;
    
    return this.treedux.subscribe(() => {
      const newValue = this.get();
      if (JSON.stringify(newValue) === JSON.stringify(currentValue)) return;
      currentValue = newValue;
      callback(currentValue);
    })
  }
  
  public use(): { value: T, set: (value: T) => Action }
  {
    // TODO: Add useState hooks
    return {value: this.get(), set: this.set.bind(this)};
  }
  
  private createProxy(): RecursiveStateNode<T>
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
    }) as unknown as RecursiveStateNode<T>
  }
}
