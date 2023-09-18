import { IsPOJO } from "./IsPojo";
import { MutatorCreator } from "./MutatorCreator";

export type Mutators<NodeType, State> = {
  // For each key
  [K in keyof NodeType]?: IsPOJO<NodeType[K]> extends true
    // If type of value is a plain JS object, recurse
    ? Mutators<NodeType[K], State>
    // If type of value is not a plain JS object, can be an map of mutators
    : { [key: string]: MutatorCreator<State> }
} | { [key: string]: MutatorCreator<State> }
