import { ObjectKeys } from "./ObjectKeys";
import { ReadOnlyRecursiveStateNode } from "./ReadOnlyRecursiveStateNode";
import { ObjectPropertyType } from "./ObjectPropertyType";

export type ReadOnlyDynamicallyTraversable<StateNodeType, StateInterface> = {
  byKey<K extends ObjectKeys<StateNodeType>>(key: K): ReadOnlyRecursiveStateNode<
    ObjectPropertyType<StateNodeType, K>,
    StateInterface
  >;
};
