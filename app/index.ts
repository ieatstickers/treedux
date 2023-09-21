
// Define data store interface
import { Treedux } from "../src/Treedux";
import { UserStore } from "./Module/User/UserStore";
import { AdblockStore } from "./Module/Adblock/AdblockStore";

// Init treedux
const treedux = Treedux.init(
  {
    [UserStore.KEY]: UserStore.create(),
    [AdblockStore.KEY]: AdblockStore.create()
  }
)

const whitelistNode = treedux.state.adblock.userSettings.whitelist;

const whitelist = whitelistNode.get();

console.log('whitelist', whitelist);

whitelistNode.subscribe((newWhitelist) => {
  console.log('whitelist changed!', newWhitelist);
})

whitelistNode.add('test.com').dispatch();
whitelistNode.add('test-2.com');

// // Get initial value
// const userName = treedux.state.user.user.name.get();
//
// console.log('user name', userName);
//
// // Subscribe to changes
// treedux.state.user.user.name.subscribe((testVal) => {
//   console.log('user name changed!', testVal);
// })
//
// // Set value
// treedux.dispatch(
//   treedux.state.user.user.set({
//     name: 'Mr Test',
//     email: 'test@gmail.com'
//   })
// );
