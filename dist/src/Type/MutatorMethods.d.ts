import { IsPOJO } from "./IsPojo";
import { MutatorCreator } from "./MutatorCreator";
import { MutatorCreators } from "./MutatorCreators";
export type MutatorMethods<StateInterface, StateNodeMutatorCreators extends MutatorCreators<{}, StateInterface>> = IsPOJO<StateNodeMutatorCreators> extends true ? {
    [K in keyof StateNodeMutatorCreators]: StateNodeMutatorCreators[K] extends MutatorCreator<StateInterface> ? ReturnType<StateNodeMutatorCreators[K]>['getAction'] : {};
} : {};
