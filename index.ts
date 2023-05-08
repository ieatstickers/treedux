import { DataStore } from "./src/Data/DataStore";
import { Treedux } from "./src/Treedux";

// Define data store interface
interface TestDataStore {
  testKey: string
}

// Define data store
const testDataStore = DataStore.create<TestDataStore>('test', {
  initialState: {
    testKey: null
  }
})

// Init treedux
const treedux = Treedux.init({
  test: testDataStore
})

// Get initial value
const testVal = treedux.state.test.testKey.get();

console.log('testVal', testVal);

// Subscribe to changes
treedux.state.test.testKey.subscribe((testVal) => {
  console.log('testKey changed!', testVal);
})

// Set value
treedux.dispatch(
  treedux.state.test.testKey.set('one'),
  treedux.state.test.testKey.set('two'),
  treedux.state.test.testKey.set('three')
);
