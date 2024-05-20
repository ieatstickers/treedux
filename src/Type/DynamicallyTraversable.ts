import { ObjectKeys } from "./ObjectKeys";
import { ObjectPropertyType } from "./ObjectPropertyType";
import { ExtractMutatorCreators } from "./ExtractMutatorCreators";
import { RecursiveStateNode } from "./RecursiveStateNode";

export type DynamicallyTraversable<StateNodeType, StateInterface, StateNodeMutatorCreators> = {
  byKey<K extends ObjectKeys<StateNodeType>>(key: K): RecursiveStateNode<
    ObjectPropertyType<StateNodeType, K>,
    StateNodeType,
    StateInterface,
    ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K>
  >;
};
