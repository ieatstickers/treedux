import { StateNodeInterface } from "./StateNodeInterface";
import { MutatorMethods } from "./MutatorMethods";

// Utility type to merge the default state node methods with the custom mutator methods
export type StateNodeWithMutators<StateNodeType, StateNodeMutatorMethods extends MutatorMethods<any, any>> = StateNodeInterface<StateNodeType> & StateNodeMutatorMethods;
