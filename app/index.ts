
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
