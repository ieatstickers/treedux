import { Action } from "../../../../src/Data/Action";
import { AdblockStateInterface } from "../AdblockStateInterface";
import { AbstractMutator } from "../../../../src/Data/AbstractMutator";
import { Treedux } from "../../../../src/Treedux";
import { AdblockStore } from "../AdblockStore";
import { MutatorInterface } from "../../../../src/Data/MutatorInterface";

export class RemoveFromWhitelist extends AbstractMutator<AdblockStateInterface> implements MutatorInterface<AdblockStateInterface>
{
  public static create(treedux: Treedux)
  {
    return new RemoveFromWhitelist(treedux);
  }
  
  public getType()
  {
    return `${AdblockStore.KEY}:remove_from_whitelist`;
  }
  
  public getAction(...domains: Array<string>)
  {
    return Action.create(
      {
        type: this.getType(),
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
