
// Type-hints for the properties present in the Type parameter
// and forces any custom keys to be functions that return any (soon to be MutatorInterface<Type> when switched out for MutatorCreator)
import { MutatorCreator } from "./MutatorCreator";
import { IsPOJO } from "./IsPojo";
import { OwnKeys } from "./OwnKeys";

export type MutatorCreators<Type, StateInterface> = { [key: string]: MutatorCreator<StateInterface> }
  & IsPOJO<Type> extends true
  ? {
    [K in OwnKeys<Type>]?: MutatorCreators<Type[K], StateInterface>
  }
  : { [key: string]: MutatorCreator<StateInterface> }
