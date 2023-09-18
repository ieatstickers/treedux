import { Action } from "../../../../src/Data/Action";
import { AdblockStateInterface } from "../AdblockStateInterface";
import { AbstractMutator } from "../../../../src/Data/AbstractMutator";
import { Treedux } from "../../../../src/Treedux";
import { AdblockStore } from "../AdblockStore";
import { MutatorInterface } from "../../../../src/Data/MutatorInterface";

export class AddToWhitelist extends AbstractMutator<AdblockStateInterface> implements MutatorInterface<AdblockStateInterface>
{
  public static create(treedux: Treedux)
  {
    return new AddToWhitelist(treedux);
  }
  
  public getAction(...domains: Array<string>)
  {
    return Action.create(
      {
        type: `${AdblockStore.KEY}:add_to_whitelist`,
        payload: domains
      },
      this.treedux
    )
  }
  
  public reduce(state: AdblockStateInterface, action: Action<Array<string>>): AdblockStateInterface
  {
    state.userSettings.whitelist.push(
      // Add any domains that are not already in the whitelist
      ...action.payload.filter((domain) => !state.userSettings.whitelist.includes(domain))
    );
    return state;
  }
}
