import { OwnKeys } from "./OwnKeys";
import { IsPrimitive } from "./IsPrimitive";
import { ReadOnlyStateNodeInterface } from "./ReadOnlyStateNodeInterface";
import { ReadOnlyDynamicallyTraversable } from "./ReadOnlyDynamicallyTraversable";
export type ReadOnlyRecursiveStateNode<StateNodeType, StateInterface> = ReadOnlyStateNodeInterface<StateNodeType> & (IsPrimitive<StateNodeType> extends true ? {} : ReadOnlyDynamicallyTraversable<StateNodeType, StateInterface>) & {
    [K in OwnKeys<StateNodeType>]: ReadOnlyRecursiveStateNode<StateNodeType[K], StateInterface>;
};
