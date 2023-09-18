import { Action } from "./Action";
import { Action as ReduxAction } from "@reduxjs/toolkit";

export interface MutatorInterface<State>
{
  getAction(...args: any): Action<any>;
  reduce(state: State, action: ReduxAction): State;
}
