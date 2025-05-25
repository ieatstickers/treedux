import { Treedux } from "../Treedux";
import { ObjectKeys } from "../Type/ObjectKeys";
import { ObjectPropertyType } from "../Type/ObjectPropertyType";
import { ReadOnlyRecursiveStateNode } from "../Type/ReadOnlyRecursiveStateNode";
import { ReadOnlyStateNodeInterface } from "../Type/ReadOnlyStateNodeInterface";
type ReadOnlyStateNodeOptions = {
    keyPath: Array<string>;
};
export declare class ReadOnlyStateNode<StateNodeType, StateInterface> implements ReadOnlyStateNodeInterface<StateNodeType> {
    private readonly treedux;
    private lastKnownValue;
    private readonly keyPath;
    protected constructor(options: ReadOnlyStateNodeOptions, treedux: Treedux);
    static create<StateNodeType, StateInterface>(options: ReadOnlyStateNodeOptions, treedux: Treedux): ReadOnlyRecursiveStateNode<StateNodeType, StateInterface>;
    get(): StateNodeType;
    subscribe(callback: (data: StateNodeType) => void): () => void;
    byKey<K extends ObjectKeys<StateNodeType>>(key: K): ReadOnlyRecursiveStateNode<ObjectPropertyType<StateNodeType, K>, StateInterface>;
    private createProxy;
}
export {};
