import { Mutators } from "./Mutators";

export type DataStoreMutators<NodeType, State> = {
  [K in keyof NodeType]?: Mutators<NodeType[K], State>
}
