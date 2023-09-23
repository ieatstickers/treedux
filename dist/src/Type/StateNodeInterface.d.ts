import { Action } from "../Data/Action";
import { MutatorMethods } from "./MutatorMethods";
export interface StateNodeInterface<Type, NodeMutatorMethods extends MutatorMethods<any, any>> {
    get(): Type;
    set(value: Type): Action<{
        keyPath: Array<string>;
        value: Type;
    }>;
    subscribe(callback: (data: Type) => void): () => void;
    use(): {
        value: Type;
        set: (value: Type) => Action<{
            keyPath: Array<string>;
            value: Type;
        }>;
    } & NodeMutatorMethods;
}
