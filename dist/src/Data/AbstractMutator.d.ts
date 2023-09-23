import { Treedux } from "../Treedux";
import { MutatorInterface } from "./MutatorInterface";
import { Action } from "./Action";
import { Action as ReduxAction } from "redux";
export declare abstract class AbstractMutator<State> implements MutatorInterface<State> {
    protected treedux: Treedux;
    protected constructor(treedux: Treedux);
    abstract getType(): string;
    abstract getAction(...args: any): Action<any>;
    abstract reduce(state: State, action: ReduxAction): void;
}
