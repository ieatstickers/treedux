import { Treedux } from "../Treedux";
import { MutatorCreators } from "../Type/MutatorCreators";
import { RecursiveStateNode } from "../Type/RecursiveStateNode";
import { MutatorInterface } from "./MutatorInterface";
import { Hooks } from "../Type/Hooks";
interface DataStoreOptions<State, Mutators extends MutatorCreators<State, State>> {
    initialState: State;
    mutators?: Mutators;
}
export declare class DataStore<StateInterface, Mutators extends MutatorCreators<StateInterface, StateInterface> = MutatorCreators<StateInterface, StateInterface>> {
    readonly KEY: string;
    private readonly initialState;
    private readonly mutators;
    private treedux;
    private hooks;
    constructor(key: string, options: DataStoreOptions<StateInterface, Mutators>);
    static create<StateInterface, Mutators extends MutatorCreators<StateInterface, StateInterface> = MutatorCreators<StateInterface, StateInterface>>(key: string, options: DataStoreOptions<StateInterface, Mutators>): DataStore<StateInterface, Mutators>;
    get state(): RecursiveStateNode<StateInterface, StateInterface, Mutators>;
    setTreedux(treedux: Treedux): this;
    setHooks(hooks: Hooks): this;
    getInitialState(): StateInterface;
    getReducers(): {
        [actionType: string]: MutatorInterface<StateInterface>['reduce'];
    };
    private hydrateReducersFromMutators;
}
export {};
