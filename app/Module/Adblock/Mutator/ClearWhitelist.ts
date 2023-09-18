import { Action } from "../../../../src/Data/Action";
import { AdblockStateInterface } from "../AdblockStateInterface";
import { AbstractMutator } from "../../../../src/Data/AbstractMutator";
import { Treedux } from "../../../../src/Treedux";
import { AdblockStore } from "../AdblockStore";

export class ClearWhitelist extends AbstractMutator<AdblockStateInterface>
{
  public static create(treedux: Treedux)
  {
    return new ClearWhitelist(treedux);
  }
  
  public getType()
  {
    return `${AdblockStore.KEY}:clear_whitelist`;
  }
  
  public getAction()
  {
    return Action.create(
      {
        type: this.getType(),
        payload: undefined
      },
      this.treedux
    )
  }
  
  public reduce(state: AdblockStateInterface, action: Action<undefined>): AdblockStateInterface
  {
    state.userSettings.whitelist = [];
    return state;
  }
}