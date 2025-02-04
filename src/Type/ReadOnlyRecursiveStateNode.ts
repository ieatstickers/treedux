import { OwnKeys } from "./OwnKeys";
import { IsPrimitive } from "./IsPrimitive";
import { ReadOnlyStateNodeInterface } from "./ReadOnlyStateNodeInterface";
import { ReadOnlyDynamicallyTraversable } from "./ReadOnlyDynamicallyTraversable";

// Recursive type to represent a read only node in the state tree. It type-hints for the default read methods available on every state
// node to get, subscribe, byKey etc. as well as type-hinting for any child nodes in the tree, so you can still continually
// traverse down the tree (always in a read only manner).
export type ReadOnlyRecursiveStateNode<StateNodeType, StateInterface> =
  ReadOnlyStateNodeInterface<StateNodeType>
  & (
  IsPrimitive<StateNodeType> extends true
    ? {}
    : ReadOnlyDynamicallyTraversable<StateNodeType, StateInterface>
  )
  & {
  [K in OwnKeys<StateNodeType>]: ReadOnlyRecursiveStateNode<
    StateNodeType[K],
    StateInterface
  >;
};
