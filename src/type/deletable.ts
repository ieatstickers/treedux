import { Action } from "../data/action";

export type Deletable = {
  delete(): Action<{ keyPath: Array<string> }>
};
