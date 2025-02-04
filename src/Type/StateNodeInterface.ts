import { Action } from "../Data/Action";
import { ReadOnlyRecursiveStateNode } from "./ReadOnlyRecursiveStateNode";

// Interface to define default methods available on every state node
export interface StateNodeInterface<Type, StateInterface>
{
  get(): Type;
  
  set(value: Type): Action<{ keyPath: Array<string>, value: Type }>;
  
  subscribe(callback: (data: Type) => void): () => void;
  
  createReadOnlyCopy(): ReadOnlyRecursiveStateNode<Type, StateInterface>;
}
