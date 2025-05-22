import { Action } from "./Action";

export interface MutatorInterface<State, Payload = any>
{
  getType(): string;
  
  getAction(...args: any): Action<Payload>;
  
  reduce(state: State, action: ReturnType<Action<Payload>["serialize"]>): void;
}
