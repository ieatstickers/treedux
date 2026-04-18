import { Action } from "../data/actionn";

export type Deletable = {
  delete(): Action<{ keyPath: Array<string> }>
};
