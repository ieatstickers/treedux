import { MutatorCreators } from "./MutatorCreators";
import { StateNodeWithMutators } from "./StateNodeWithMutators";
import { OwnKeys } from "./OwnKeys";
import { MutatorMethods } from "./MutatorMethods";
import { IsPrimitive } from "./IsPrimitive";
import { ExtractMutatorCreators } from "./ExtractMutatorCreators";
import { DynamicallyTraversable } from "./DynamicallyTraversable";
import { Deletable } from "./Deletable";

// Recursive type to represent a node in the state tree. It type-hints for the default methods available on every state
// node to get, set, subscribe etc. as well as any custom mutator methods that have been passed in. It also type-hints
// for any child nodes in the tree, so you can continually traverse down.
export type RecursiveStateNode<StateNodeType, ParentStateNodeType, StateInterface, StateNodeMutatorCreators extends MutatorCreators<StateNodeType, StateInterface> = {}> =
  StateNodeWithMutators<StateNodeType, StateInterface, MutatorMethods<StateInterface, StateNodeMutatorCreators>>
  & (
  IsPrimitive<StateNodeType> extends true
    ? {}
    : DynamicallyTraversable<StateNodeType, StateInterface, StateNodeMutatorCreators>
  )
  & (
  string extends keyof ParentStateNodeType
    ? Deletable
    : number extends keyof ParentStateNodeType
      ? Deletable
      : {}
  )
  & {
  [K in OwnKeys<StateNodeType>]: RecursiveStateNode<
    StateNodeType[K],
    StateNodeType,
    StateInterface,
    ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K> extends MutatorCreators<StateNodeType[K], StateInterface>
      ? ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K>
      : MutatorCreators<StateNodeType[K], StateInterface>
  >;
};
