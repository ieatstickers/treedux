import { MutatorCreators } from "./MutatorCreators";

// TODO: Re-implement this when happy with the rest of the type-hinting
export type DataStoreMutators<NodeType, State> = {
  [K in keyof NodeType]?: MutatorCreators<NodeType[K]>
}
