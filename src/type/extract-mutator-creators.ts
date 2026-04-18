// Helper type to extract the mutator creators for a given key
import { MutatorCreators } from "./mutator-creators";
import { ObjectPropertyType } from "./object-property-type";

export type ExtractMutatorCreators<
  StateNodeType,
  StateInterface,
  StateNodeMutatorCreators,
  K
> = K extends keyof StateNodeMutatorCreators
  ? StateNodeMutatorCreators[K] extends MutatorCreators<ObjectPropertyType<StateNodeType, K>, StateInterface>
    ? StateNodeMutatorCreators[K]
    : {}
  : {};
