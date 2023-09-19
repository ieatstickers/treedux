
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

// TODO: Type-hinting doesn't recognise add (mutator override) and subscribe (default method) as methods off the bat
//  and require brackets to be added manually unlike get and set (default methods), which add the brackets automatically
//  when you hit enter and put the cursor inside the brackets
treedux.state.adblock.userSettings.whitelist.add
treedux.state.adblock.userSettings.whitelist.subscribe

treedux
  .state
  .adblock
  .userSettings
  .whitelist
  .add(treedux)
  .getAction('www.example-domain.com') // TODO: Rather than whitelist.add().getAction(), need to refactor to allow whitelist.add() and pull through the types of the mutator class getAction method
  .dispatch()

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
