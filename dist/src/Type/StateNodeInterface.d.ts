import { Action } from "../Data/Action";
import { ReadOnlyRecursiveStateNode } from "./ReadOnlyRecursiveStateNode";
export interface StateNodeInterface<Type, StateInterface> {
    get(): Type;
    set(value: Type): Action<{
        keyPath: Array<string>;
        value: Type;
    }>;
    subscribe(callback: (data: Type) => void): () => void;
    toReadOnly(): ReadOnlyRecursiveStateNode<Type, StateInterface>;
}
