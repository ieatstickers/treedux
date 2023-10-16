import { MutatorCreator } from "./MutatorCreator";
import { IsPOJO } from "./IsPojo";
import { OwnKeys } from "./OwnKeys";
export type MutatorCreators<Type, StateInterface> = {
    [key: string]: MutatorCreator<StateInterface>;
} & IsPOJO<Type> extends true ? {
    [K in OwnKeys<Type>]?: MutatorCreators<Type[K], StateInterface> | MutatorCreator<StateInterface>;
} : {
    [key: string]: MutatorCreator<StateInterface>;
};
