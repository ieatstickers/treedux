import { Action } from "../../../../src/Data/Action";
import { AdblockStateInterface } from "../AdblockStateInterface";
import { AbstractMutator } from "../../../../src/Data/AbstractMutator";
import { Treedux } from "../../../../src/Treedux";
import { AdblockStore } from "../AdblockStore";

export class RemoveFromWhitelist extends AbstractMutator<AdblockStateInterface>
{
  public static create(treedux: Treedux)
  {
    return new RemoveFromWhitelist(treedux);
  }
  
  public getAction(...domains: Array<string>)
  {
    return Action.create(
      {
        type: `${AdblockStore.KEY}:remove_from_whitelist`,
        payload: domains
      },
      this.treedux
    )
  }
  
  public reduce(state: AdblockStateInterface, action: Action<Array<string>>): AdblockStateInterface
  {
    state.userSettings.whitelist = state.userSettings.whitelist.filter((domain) => !action.payload.includes(domain));
    return state;
  }
}
