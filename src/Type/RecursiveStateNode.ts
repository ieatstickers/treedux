// Recursive type to generate the structure of your state tree with type-hinted methods
import { MutatorCreators } from "./MutatorCreators";
import { StateNodeInterface } from "./StateNodeInterface";
import { StateNodeWithMutatorCreators } from "./StateNodeWithMutatorCreators";

// Recursive type to generate the structure of your state tree
// Type-hints for the properties present in the Type parameter so you can traverse the entire tree
// Also type-hints for any mutator creators added to each node in the tree
export type RecursiveStateNode<StateNodeType, StateNodeMutatorCreators extends MutatorCreators<StateNodeType> = {}> = {
  [K in keyof StateNodeType]: StateNodeType[K] extends Record<string, any> // TODO: Can this be locked down further e.g. IsPOJO?
    ? RecursiveStateNode<StateNodeType[K], K extends keyof StateNodeMutatorCreators ? StateNodeMutatorCreators[K] : {}>
    & StateNodeWithMutatorCreators<StateNodeType[K], K extends keyof StateNodeMutatorCreators ? StateNodeMutatorCreators[K] : {}>
    : StateNodeInterface<StateNodeType[K]>
}
