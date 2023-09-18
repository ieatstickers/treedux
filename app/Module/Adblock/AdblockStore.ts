import { DataStore } from "../../../src/Data/DataStore";
import { AdblockStateInterface } from "./AdblockStateInterface";
import { Treedux } from "../../../src/Treedux";
import { AddToWhitelist } from "./Mutator/AddToWhitelist";
import { RemoveFromWhitelist } from "./Mutator/RemoveFromWhitelist";
import { ClearWhitelist } from "./Mutator/ClearWhitelist";

export class AdblockStore
{
  public static KEY: 'adblock' = 'adblock';
  
  public static create()
  {
    return DataStore.create<AdblockStateInterface>(
      this.KEY,
      {
        initialState: {
          status: 'stopped',
          userSettings: {
            whitelist: [],
            userDisabledFilters: []
          }
        },
        mutators: {
          userSettings: {
            whitelist: {
              add: (treedux: Treedux) => AddToWhitelist.create(treedux),
              remove: (treedux: Treedux) => RemoveFromWhitelist.create(treedux),
              clear: (treedux: Treedux) => ClearWhitelist.create(treedux)
            },
          }
        }
      }
    )
  }
}
