import { StateNodeInterface } from "./StateNodeInterface";
import { MutatorMethods } from "./MutatorMethods";
export type StateNodeWithMutators<StateNodeType, StateInterface, StateNodeMutatorMethods extends MutatorMethods<any, any> | undefined> = StateNodeInterface<StateNodeType, StateInterface> & StateNodeMutatorMethods;
