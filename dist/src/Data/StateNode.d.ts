import { Treedux } from "../Treedux";
import { Action } from "./Action";
import { RecursiveStateNode } from "../Type/RecursiveStateNode";
import { MutatorCreators } from "../Type/MutatorCreators";
import { StateNodeInterface } from "../Type/StateNodeInterface";
import { MutatorMethods } from "../Type/MutatorMethods";
type StateNodeOptions<T, StateInterface> = {
    keyPath: Array<string>;
    mutators?: MutatorCreators<T, StateInterface>;
};
export declare class StateNode<StateNodeType, StateInterface, Options extends StateNodeOptions<StateNodeType, StateInterface> = StateNodeOptions<StateNodeType, StateInterface>> implements StateNodeInterface<StateNodeType, MutatorMethods<StateInterface, Options['mutators']>> {
    private readonly treedux;
    private lastKnownValue;
    private readonly keyPath;
    private readonly mutators;
    protected constructor(options: StateNodeOptions<StateNodeType, StateInterface>, treedux: Treedux);
    static create<StateNodeType, StateInterface, Options extends StateNodeOptions<StateNodeType, StateInterface> = StateNodeOptions<StateNodeType, StateInterface>>(options: StateNodeOptions<StateNodeType, StateInterface>, treedux: Treedux): RecursiveStateNode<StateNodeType, StateInterface, Options['mutators']>;
    get(): StateNodeType;
    set(value: StateNodeType): Action<{
        keyPath: Array<string>;
        value: StateNodeType;
    }>;
    subscribe(callback: (data: StateNodeType) => void): () => void;
    use(): {
        value: StateNodeType;
        set: (value: StateNodeType) => Action<{
            keyPath: Array<string>;
            value: StateNodeType;
        }>;
    } & MutatorMethods<StateInterface, Options['mutators']>;
    private createProxy;
    private getMutatorMethod;
    private getMutatorMethods;
}
export {};
