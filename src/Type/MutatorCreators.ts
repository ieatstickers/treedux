
import { MutatorCreator } from "./MutatorCreator";
import { IsPOJO } from "./IsPojo";
import { OwnKeys } from "./OwnKeys";

// Recursive type that defines the structure of the mutators that can be passed to a state node for a given Type
// It defines that what type of mutators can be associated with each node in the tree based on what type of data that
// node represents.
export type MutatorCreators<Type, StateInterface> = { [key: string]: MutatorCreator<StateInterface> }
  & IsPOJO<Type> extends true
  ? {
    [K in OwnKeys<Type>]?: MutatorCreators<Type[K], StateInterface> | MutatorCreator<StateInterface>
  }
  : { [key: string]: MutatorCreator<StateInterface> }
