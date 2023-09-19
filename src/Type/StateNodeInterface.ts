import { Action } from "../Data/Action";

// Interface to define default methods available on every state node
export interface StateNodeInterface<Type>
{
  get(): Type,
  set(value: Type): Action<{ keyPath: Array<string>, value: Type }>
  subscribe(callback: (data: Type) => void): () => void,
  use(): { value: Type, set: (value: Type) => Action<{ keyPath: Array<string>, value: Type }> }
}
