import { DataStore } from "./src/Data/DataStore";
import { Treedux } from "./src/Treedux";

// Define data store interface
interface UserStore {
  user: { name: string },
  plan: { code: string, name: string, expiry: Date },
  status: string
}

// Define data store
const userDataStore = DataStore.create<UserStore>('user', {
  initialState: {
    user: null,
    plan: null,
    status: null
  }
})

// Init treedux
const treedux = Treedux.init({
  user: userDataStore
})

// Get initial value
const userStatus = treedux.state.user.status.get();

console.log('status', userStatus);

// Subscribe to changes
treedux.state.user.status.subscribe((testVal) => {
  console.log('status changed!', testVal);
})

// Set value
treedux.dispatch(
  treedux.state.user.status.set('one'),
  treedux.state.user.status.set('two'),
  treedux.state.user.status.set('three')
);
