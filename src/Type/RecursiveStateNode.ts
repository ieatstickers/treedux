import { MutatorCreators } from "./MutatorCreators";
import { StateNodeWithMutators } from "./StateNodeWithMutators";
import { OwnKeys } from "./OwnKeys";
import { MutatorMethods } from "./MutatorMethods";
import { ObjectKeys } from "./ObjectKeys";
import { ObjectPropertyType } from "./ObjectPropertyType";
import { IsPrimitive } from "./IsPrimitive";
import { ExtractMutatorCreators } from "./ExtractMutatorCreators";

// Recursive type to represent a node in the state tree. It type-hints for the default methods available on every state
// node to get, set, subscribe etc. as well as any custom mutator methods that have been passed in. It also type-hints
// for any child nodes in the tree, so you can continually traverse down.
export type RecursiveStateNode<StateNodeType, StateInterface, StateNodeMutatorCreators extends MutatorCreators<StateNodeType, StateInterface> = {}> =
  StateNodeWithMutators<StateNodeType, MutatorMethods<StateInterface, StateNodeMutatorCreators>>
  & (
  IsPrimitive<StateNodeType> extends true
    ? {}
    : {
      byKey<K extends ObjectKeys<StateNodeType>>(key: K): RecursiveStateNode<
        ObjectPropertyType<StateNodeType, K>,
        StateInterface,
        ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K>
      >;
    }
  )
  & {
  [K in OwnKeys<StateNodeType>]: RecursiveStateNode<
    StateNodeType[K],
    StateInterface,
    ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K> extends MutatorCreators<StateNodeType[K], StateInterface>
      ? ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K>
      : MutatorCreators<StateNodeType[K], StateInterface>
  >;
};
