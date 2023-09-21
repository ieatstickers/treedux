// Recursive type to generate the structure of your state tree with type-hinted methods
import { MutatorCreators } from "./MutatorCreators";
import { StateNodeWithMutators } from "./StateNodeWithMutators";
import { OwnKeys } from "./OwnKeys";
import { MutatorMethods } from "./MutatorMethods";

// Recursive type to generate the structure of your state tree
// Type-hints for the properties present in the Type parameter so you can traverse the entire tree
// Also type-hints for any mutator creators added to each node in the tree
export type RecursiveStateNode<StateNodeType, StateInterface, StateNodeMutatorCreators extends MutatorCreators<StateNodeType, StateInterface> = {}> =
  StateNodeWithMutators<StateNodeType, MutatorMethods<StateInterface, StateNodeMutatorCreators>>
  & {
  // For each key in the POJO
  [K in OwnKeys<StateNodeType>]: RecursiveStateNode<StateNodeType[K], StateInterface, StateNodeMutatorCreators extends Record<K, any> ? StateNodeMutatorCreators[K] : {}>
}
