import { IsPOJO } from "./IsPojo";
import { MutatorCreator } from "./MutatorCreator";
import { MutatorCreators } from "./MutatorCreators";

// Although it is MutatorCreators that are passed to a state node, it's actually the getAction() method of each mutator
// that we want to type-hint for when traversing through a Treedux state tree. This utility type parses the MutatorCreators
// and returns a type-hinted object of the getAction() methods for each mutator that can then be merged with the default
// types for a state node
export type MutatorMethods<StateInterface, StateNodeMutatorCreators extends MutatorCreators<{}, StateInterface>> = IsPOJO<StateNodeMutatorCreators> extends true
  ? {
    [K in keyof StateNodeMutatorCreators]: StateNodeMutatorCreators[K] extends MutatorCreator<StateInterface>
      ? ReturnType<StateNodeMutatorCreators[K]>['getAction']
      : {}
  }
  : {}
