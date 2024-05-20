import { MutatorCreators } from "./MutatorCreators";
import { StateNodeWithMutators } from "./StateNodeWithMutators";
import { OwnKeys } from "./OwnKeys";
import { MutatorMethods } from "./MutatorMethods";
import { IsPrimitive } from "./IsPrimitive";
import { ExtractMutatorCreators } from "./ExtractMutatorCreators";
import { DynamicallyTraversable } from "./DynamicallyTraversable";
import { Deletable } from "./Deletable";
export type RecursiveStateNode<StateNodeType, ParentStateNodeType, StateInterface, StateNodeMutatorCreators extends MutatorCreators<StateNodeType, StateInterface> = {}> = StateNodeWithMutators<StateNodeType, MutatorMethods<StateInterface, StateNodeMutatorCreators>> & (IsPrimitive<StateNodeType> extends true ? {} : DynamicallyTraversable<StateNodeType, StateInterface, StateNodeMutatorCreators>) & (string extends keyof ParentStateNodeType ? Deletable : number extends keyof ParentStateNodeType ? Deletable : {}) & {
    [K in OwnKeys<StateNodeType>]: RecursiveStateNode<StateNodeType[K], StateNodeType, StateInterface, ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K> extends MutatorCreators<StateNodeType[K], StateInterface> ? ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K> : MutatorCreators<StateNodeType[K], StateInterface>>;
};
