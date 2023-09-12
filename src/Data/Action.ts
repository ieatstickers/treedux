type DispatchAction = (action: Action) => void

export class Action
{
  private readonly dispatchAction: DispatchAction;
  public readonly type: string;
  public readonly payload: any;

  private constructor(action: { type: string, payload: any }, dispatch: DispatchAction)
  {
    this.type = action.type;
    this.payload = action.payload;
    this.dispatchAction = dispatch;
  }

  public static create(
    action: { type: string, payload: any },
    dispatch: (action: Action) => void
  ): Action
  {
    return new Action(action, dispatch);
  }

  public dispatch(): void
  {
    this.dispatchAction(this);
  }

  public serialize(): { type: string, payload: any }
  {
    return { type: this.type, payload: this.payload };
  }
}

