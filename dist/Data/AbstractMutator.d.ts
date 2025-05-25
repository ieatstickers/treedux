import { Treedux } from "../Treedux";
import { MutatorInterface } from "./MutatorInterface";
import { Action } from "./Action";
export declare abstract class AbstractMutator<State, Payload = any> implements MutatorInterface<State, Payload> {
    protected treedux: Treedux;
    constructor(treedux: Treedux);
    abstract getType(): string;
    abstract getAction(...args: any): Action<Payload>;
    abstract reduce(state: State, action: ReturnType<Action<Payload>["serialize"]>): void;
}
