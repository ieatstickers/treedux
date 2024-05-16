import { MutatorCreators } from "./MutatorCreators";
import { StateNodeWithMutators } from "./StateNodeWithMutators";
import { OwnKeys } from "./OwnKeys";
import { MutatorMethods } from "./MutatorMethods";
import { ObjectKeys } from "./ObjectKeys";
import { ObjectPropertyType } from "./ObjectPropertyType";
import { IsPrimitive } from "./IsPrimitive";
import { ExtractMutatorCreators } from "./ExtractMutatorCreators";
export type RecursiveStateNode<StateNodeType, StateInterface, StateNodeMutatorCreators extends MutatorCreators<StateNodeType, StateInterface> = {}> = StateNodeWithMutators<StateNodeType, MutatorMethods<StateInterface, StateNodeMutatorCreators>> & (IsPrimitive<StateNodeType> extends true ? {} : {
    byKey<K extends ObjectKeys<StateNodeType>>(key: K): RecursiveStateNode<ObjectPropertyType<StateNodeType, K>, StateInterface, ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K>>;
}) & {
    [K in OwnKeys<StateNodeType>]: RecursiveStateNode<StateNodeType[K], StateInterface, ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K> extends MutatorCreators<StateNodeType[K], StateInterface> ? ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K> : MutatorCreators<StateNodeType[K], StateInterface>>;
};
