import { StateNodeInterface } from "./StateNodeInterface";
import { MutatorMethods } from "./MutatorMethods";
export type StateNodeWithMutators<StateNodeType, StateNodeMutatorMethods extends MutatorMethods<any, any>> = StateNodeInterface<StateNodeType> & StateNodeMutatorMethods;
