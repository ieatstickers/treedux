
import { MutatorCreators } from "./MutatorCreators";
import { StateNodeInterface } from "./StateNodeInterface";

// Helper type to merge StateNodeInterface with any StateNodeMutatorCreators for this node
// TODO: Rename to StateNodeWithMutators when refactored to type-hint for mutator class getAction method rather than mutator creator itself
export type StateNodeWithMutatorCreators<StateNodeType, StateNodeMutatorCreators extends MutatorCreators<StateNodeType>> = StateNodeInterface<StateNodeType> & StateNodeMutatorCreators;
