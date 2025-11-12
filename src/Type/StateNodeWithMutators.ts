import { StateNodeInterface } from "./StateNodeInterface";
import { MutatorMethods } from "./MutatorMethods";

// Utility type to merge the default state node methods with the custom mutator methods
export type StateNodeWithMutators<StateNodeType, StateInterface, StateNodeMutatorMethods extends MutatorMethods<any, any> | undefined> =
  StateNodeInterface<StateNodeType, StateInterface>
  & StateNodeMutatorMethods;
