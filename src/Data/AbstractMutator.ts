import { Treedux } from "../Treedux";
import { MutatorInterface } from "./MutatorInterface";
import { Action } from "./Action";

export abstract class AbstractMutator<State, Payload = any> implements MutatorInterface<State, Payload>
{
  protected treedux: Treedux;
  
  public constructor(treedux: Treedux)
  {
    this.treedux = treedux;
  }
  
  public abstract getType(): string;
  
  public abstract getAction(...args: any): Action<Payload>;
  
  public abstract reduce(state: State, action: ReturnType<Action<Payload>["serialize"]>): void;
}
