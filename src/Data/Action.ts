import { Treedux } from "../Treedux";

export class Action<Payload>
{
  private readonly treedux: Treedux;
  public readonly type: string;
  public readonly payload: Payload;
  
  private constructor(action: { type: string, payload?: Payload }, treedux: Treedux)
  {
    this.type = action.type;
    this.payload = action.payload;
    this.treedux = treedux;
  }
  
  public static create<Payload>(
    action: { type: string, payload?: Payload },
    treedux: Treedux
  ): Action<Payload>
  {
    return new Action(action, treedux);
  }
  
  public dispatch(): void
  {
    this.treedux.dispatch(this);
  }
  
  public serialize(): { type: string, payload: Payload }
  {
    return { type: this.type, payload: this.payload };
  }
}

