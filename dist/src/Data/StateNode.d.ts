import { Treedux } from "../Treedux";
import { Action } from "./Action";
import { RecursiveStateNode } from "../Type/RecursiveStateNode";
import { MutatorCreators } from "../Type/MutatorCreators";
import { StateNodeInterface } from "../Type/StateNodeInterface";
import { ObjectKeys } from "../Type/ObjectKeys";
import { ObjectPropertyType } from "../Type/ObjectPropertyType";
import { ReadOnlyRecursiveStateNode } from "../Type/ReadOnlyRecursiveStateNode";
type StateNodeOptions<T, StateInterface> = {
    keyPath: Array<string>;
    mutators?: MutatorCreators<T, StateInterface>;
};
export declare class StateNode<StateNodeType, ParentStateNodeType, StateInterface, Options extends StateNodeOptions<StateNodeType, StateInterface> = StateNodeOptions<StateNodeType, StateInterface>> implements StateNodeInterface<StateNodeType, StateInterface> {
    private readonly treedux;
    private lastKnownValue;
    private readonly keyPath;
    private readonly mutators;
    protected constructor(options: StateNodeOptions<StateNodeType, StateInterface>, treedux: Treedux);
    static create<StateNodeType, ParentStateNodeType, StateInterface, Options extends StateNodeOptions<StateNodeType, StateInterface> = StateNodeOptions<StateNodeType, StateInterface>>(options: StateNodeOptions<StateNodeType, StateInterface>, treedux: Treedux): RecursiveStateNode<StateNodeType, ParentStateNodeType, StateInterface, Options["mutators"]>;
    get(): StateNodeType;
    set(value: StateNodeType): Action<{
        keyPath: Array<string>;
        value: StateNodeType;
    }>;
    subscribe(callback: (data: StateNodeType) => void): () => void;
    byKey<K extends ObjectKeys<StateNodeType>>(key: K): RecursiveStateNode<ObjectPropertyType<StateNodeType, K>, StateNodeType, StateInterface, K extends keyof Options["mutators"] ? Options["mutators"][K] extends MutatorCreators<ObjectPropertyType<StateNodeType, K>, StateInterface> ? Options["mutators"][K] : {} : {}>;
    delete(): Action<{
        keyPath: Array<string>;
    }>;
    toReadOnly(): ReadOnlyRecursiveStateNode<StateNodeType, StateInterface>;
    private createProxy;
    private getMutatorMethod;
}
export {};
