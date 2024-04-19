import { Action } from "../Data/Action";
export interface StateNodeInterface<Type> {
    get(): Type;
    set(value: Type): Action<{
        keyPath: Array<string>;
        value: Type;
    }>;
    subscribe(callback: (data: Type) => void): () => void;
}
