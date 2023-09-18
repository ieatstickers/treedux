
// Define data store interface
import { Treedux } from "../src/Treedux";
import { UserStore } from "./Module/User/UserStore";
import { AdblockStore } from "./Module/Adblock/AdblockStore";
import { AddToWhitelist } from "./Module/Adblock/Mutator/AddToWhitelist";
import { MutatorInterface } from "../src/Data/MutatorInterface";
import { AdblockStateInterface } from "./Module/Adblock/AdblockStateInterface";
import { ClearWhitelist } from "./Module/Adblock/Mutator/ClearWhitelist";
import { RemoveFromWhitelist } from "./Module/Adblock/Mutator/RemoveFromWhitelist";

// Init treedux
const treedux = Treedux.init({
  [UserStore.KEY]: UserStore.create(),
  [AdblockStore.KEY]: AdblockStore.create()
})

type IsPOJO<T> = T extends Record<string, any>
  ? (T extends any[] | ((...args: any[]) => any) | Date | RegExp ? false : true)
  : false;

// THIS WORKS!!!
type NodeOverrides<T> = {
  // For each key
  [K in keyof T]?: IsPOJO<T[K]> extends true // T[K] extends Record<string, unknown>
    // If type of value is a plain JS object, recurse
    ? NodeOverrides<T[K]> | { [key: string]: ((treedux: Treedux) => MutatorInterface<any>) }
    // If type of value is not a plain JS object, can be an map of mutators
    : { [key: string]: (treedux: Treedux) => MutatorInterface<any> }
}

// Usage

const example1: NodeOverrides<AdblockStateInterface> = {
  userSettings: {
    test: (treedux: Treedux) => AddToWhitelist.create(treedux),
    whitelist: {
      add: (treedux: Treedux) => AddToWhitelist.create(treedux),
    }
  }
  // userSettings: {
  //   tits: (treedux: Treedux) => AddToWhitelist.create(treedux),
  //   whitelist: {
  //     add: (treedux: Treedux) => AddToWhitelist.create(treedux),
  //     clear: (treedux: Treedux) => ClearWhitelist.create(treedux),
  //     remove: (treedux: Treedux) => RemoveFromWhitelist.create(treedux),
  //   },
    // userDisabledFilters: {
    //   add: (treedux: Treedux) => AddToWhitelist.create(treedux),
    // }
  // }
};


// Get initial value
const userName = treedux.state.user.user.name.get();

console.log('user name', userName);

// Subscribe to changes
treedux.state.user.user.name.subscribe((testVal) => {
  console.log('user name changed!', testVal);
})

// Set value
treedux.dispatch(
  treedux.state.user.user.name.set('one'),
  treedux.state.user.user.name.set('two'),
  treedux.state.user.user.name.set('three')
);
