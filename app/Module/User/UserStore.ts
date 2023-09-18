import { DataStore } from "../../../src/Data/DataStore";
import { UserStateInterface } from "./UserStateInterface";

export class UserStore
{
  public static KEY: 'user' = 'user';
  
  public static create()
  {
    return DataStore.create<UserStateInterface>(
      this.KEY,
      {
        initialState: {
          user: null,
          plan: null
        }
      }
    )
  }
}
