import { Action } from "../Data/Action";
export type Deletable = {
    delete(): Action<{
        keyPath: Array<string>;
    }>;
};
