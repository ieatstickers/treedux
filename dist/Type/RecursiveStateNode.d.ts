import { MutatorCreators } from "./MutatorCreators";
import { StateNodeWithMutators } from "./StateNodeWithMutators";
import { OwnKeys } from "./OwnKeys";
import { MutatorMethods } from "./MutatorMethods";
import { IsPrimitive } from "./IsPrimitive";
import { ExtractMutatorCreators } from "./ExtractMutatorCreators";
import { DynamicallyTraversable } from "./DynamicallyTraversable";
import { Deletable } from "./Deletable";
export type RecursiveStateNode<StateNodeType, ParentStateNodeType, StateInterface, StateNodeMutatorCreators extends MutatorCreators<StateNodeType, StateInterface> | undefined = {}> = StateNodeWithMutators<StateNodeType, StateInterface, MutatorMethods<StateInterface, StateNodeMutatorCreators>> & (IsPrimitive<StateNodeType> extends true ? {} : DynamicallyTraversable<NonNullable<StateNodeType>, StateInterface, StateNodeMutatorCreators>) & (string extends keyof ParentStateNodeType ? Deletable : number extends keyof ParentStateNodeType ? Deletable : {}) & {
    [K in OwnKeys<NonNullable<StateNodeType>>]: RecursiveStateNode<NonNullable<StateNodeType>[K], StateNodeType, StateInterface, ExtractMutatorCreators<NonNullable<StateNodeType>, StateInterface, StateNodeMutatorCreators, K> extends MutatorCreators<NonNullable<StateNodeType>[K], StateInterface> ? ExtractMutatorCreators<NonNullable<StateNodeType>, StateInterface, StateNodeMutatorCreators, K> : MutatorCreators<NonNullable<StateNodeType>[K], StateInterface>>;
};
