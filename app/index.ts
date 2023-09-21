
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

// .add was type-hinted by the IDE but didn't add the brackets
treedux.state.adblock.userSettings.whitelist.add

// But if you set the whitelist node to its own variable
const node = treedux.state.adblock.userSettings.whitelist;

// Then .add() is type-hinted AND adds the brackets for you and positions the cursor inside the brackets
node.add()

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
