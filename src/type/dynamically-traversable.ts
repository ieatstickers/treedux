import { ObjectKeys } from "./object-keys";
import { ObjectPropertyType } from "./object-property-type";
import { ExtractMutatorCreators } from "./extract-mutator-creators";
import { RecursiveStateNode } from "./recursive-state-node";

export type DynamicallyTraversable<StateNodeType, StateInterface, StateNodeMutatorCreators> = {
  byKey<K extends ObjectKeys<StateNodeType>>(key: K): RecursiveStateNode<
    ObjectPropertyType<StateNodeType, K>,
    StateNodeType,
    StateInterface,
    ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K>
  >;
};
