import { StateNodeInterface } from "./state-node-interface";
import { MutatorMethods } from "./mutator-methods";

// Utility type to merge the default state node methods with the custom mutator methods
export type StateNodeWithMutators<StateNodeType, StateInterface, StateNodeMutatorMethods extends MutatorMethods<any, any> | undefined> =
  StateNodeInterface<StateNodeType, StateInterface>
  & StateNodeMutatorMethods;
