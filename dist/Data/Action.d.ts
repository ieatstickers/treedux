import { Treedux } from "../Treedux";
export declare class Action<Payload> {
    private readonly treedux;
    readonly type: string;
    readonly payload: Payload;
    private constructor();
    static create<Payload>(action: {
        type: string;
        payload?: Payload;
    }, treedux: Treedux): Action<Payload>;
    dispatch(): void;
    serialize(): {
        type: string;
        payload: Payload;
    };
}
