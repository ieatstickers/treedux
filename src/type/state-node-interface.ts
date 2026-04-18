import { Action } from "../data/actionn";
import { ReadOnlyRecursiveStateNode } from "./read-only-recursive-state-node";

// Interface to define default methods available on every state node
export interface StateNodeInterface<Type, StateInterface>
{
  get(): Type;

  set(value: Type): Action<{ keyPath: Array<string>, value: Type }>;

  subscribe(callback: (data: Type) => void): () => void;

  toReadOnly(): ReadOnlyRecursiveStateNode<Type, StateInterface>;
}
