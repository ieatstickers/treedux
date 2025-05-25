import { OwnKeys } from "./OwnKeys";
import { IsPrimitive } from "./IsPrimitive";
import { ReadOnlyStateNodeInterface } from "./ReadOnlyStateNodeInterface";
import { ReadOnlyDynamicallyTraversable } from "./ReadOnlyDynamicallyTraversable";
export type ReadOnlyRecursiveStateNode<StateNodeType, StateInterface> = ReadOnlyStateNodeInterface<StateNodeType> & (IsPrimitive<StateNodeType> extends true ? {} : ReadOnlyDynamicallyTraversable<NonNullable<StateNodeType>, StateInterface>) & {
    [K in OwnKeys<NonNullable<StateNodeType>>]: ReadOnlyRecursiveStateNode<NonNullable<StateNodeType>[K], StateInterface>;
};
