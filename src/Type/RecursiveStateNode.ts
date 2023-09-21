// Recursive type to generate the structure of your state tree with type-hinted methods
import { MutatorCreators } from "./MutatorCreators";
import { StateNodeWithMutators } from "./StateNodeWithMutators";
import { OwnKeys } from "./OwnKeys";
import { MutatorMethods } from "./MutatorMethods";

// Recursive type to represent a node in the state tree. It type-hints for the default methods available on every state
// node to get, set, subscribe etc. as well as any custom mutator methods that have been passed in. It also type-hints
// for any child nodes in the tree so you can continually traverse down.
export type RecursiveStateNode<StateNodeType, StateInterface, StateNodeMutatorCreators extends MutatorCreators<StateNodeType, StateInterface> = {}> =
  StateNodeWithMutators<StateNodeType, MutatorMethods<StateInterface, StateNodeMutatorCreators>>
  & {
  // For each key in the POJO
  [K in OwnKeys<StateNodeType>]: RecursiveStateNode<StateNodeType[K], StateInterface, StateNodeMutatorCreators extends Record<K, any> ? StateNodeMutatorCreators[K] : {}>
}
