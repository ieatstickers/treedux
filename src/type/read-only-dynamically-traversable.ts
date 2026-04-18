import { ObjectKeys } from "./object-keys";
import { ReadOnlyRecursiveStateNode } from "./read-only-recursive-state-node";
import { ObjectPropertyType } from "./object-property-type";

export type ReadOnlyDynamicallyTraversable<StateNodeType, StateInterface> = {
  byKey<K extends ObjectKeys<StateNodeType>>(key: K): ReadOnlyRecursiveStateNode<
    ObjectPropertyType<StateNodeType, K>,
    StateInterface
  >;
};
