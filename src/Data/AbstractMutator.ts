import { Treedux } from "../Treedux";
import { MutatorInterface } from "./MutatorInterface";
import { Action } from "./Action";
import { Action as ReduxAction } from "redux";

export abstract class AbstractMutator<State> implements MutatorInterface<State>
{
  protected treedux: Treedux;
  
  protected constructor(treedux: Treedux)
  {
    this.treedux = treedux;
  }
  
  public abstract getType(): string;
  
  public abstract getAction(...args: any): Action<any>;
  
  public abstract reduce(state: State, action: ReduxAction): void;
}
