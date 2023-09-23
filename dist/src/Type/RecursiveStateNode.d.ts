import { MutatorCreators } from "./MutatorCreators";
import { StateNodeWithMutators } from "./StateNodeWithMutators";
import { OwnKeys } from "./OwnKeys";
import { MutatorMethods } from "./MutatorMethods";
export type RecursiveStateNode<StateNodeType, StateInterface, StateNodeMutatorCreators extends MutatorCreators<StateNodeType, StateInterface> = {}> = StateNodeWithMutators<StateNodeType, MutatorMethods<StateInterface, StateNodeMutatorCreators>> & {
    [K in OwnKeys<StateNodeType>]: RecursiveStateNode<StateNodeType[K], StateInterface, StateNodeMutatorCreators extends Record<K, any> ? StateNodeMutatorCreators[K] : {}>;
};
