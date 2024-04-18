
import { Treedux } from "./Treedux";
import { Hooks } from "./Type/Hooks";
import { DefaultDataStoreMap } from "./Type/DefaultDataStoreMap";
import { combineReducers, configureStore, createReducer } from "@reduxjs/toolkit";

jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  createReducer: jest.fn(() => ({ reducer: true })),
  combineReducers: jest.fn().mockReturnValue({ combinedReducer: true }),
  configureStore: jest.fn().mockImplementation(() => {
    return { store: true }
  })
}));

class TestTreedux<DataStoreMap extends DefaultDataStoreMap = DefaultDataStoreMap> extends Treedux {
  public constructor(
    dataStores: DataStoreMap,
    options?: {
      initialState?: any,
      hooks?: Hooks
    }
  )
  {
    super(dataStores, options);
  }
}

describe("Treedux", () => {

  describe("constructor", () => {
    const testDataStore = {
      setTreedux: jest.fn(),
      setHooks: jest.fn(),
      getInitialState: jest.fn().mockReturnValue({ testInitialState: true }),
      getReducers: jest.fn().mockReturnValue({ testReducers: true }),
    };
    
    const testDataStore2 = {
      setTreedux: jest.fn(),
      setHooks: jest.fn(),
      getInitialState: jest.fn().mockReturnValue({ test2InitialState: true }),
      getReducers: jest.fn().mockReturnValue({ test2Reducers: true }),
    };
    
    const dataStores: any = {
      'testDataStore': testDataStore,
      'testDataStore2': testDataStore2
    };
    
    const initialState = {};
    const useEffect: any = () => {};
    const useState: any = () => {};
    const options = {
      initialState: initialState,
      hooks: {
        useEffect: useEffect,
        useState: useState
      }
    };
    
    let treedux: any;
    
    beforeEach(() => {
      treedux = new TestTreedux(dataStores, options);
    });
    
    afterEach(() => {
      jest.clearAllMocks();
    })
    
    it("correctly sets internal properties", () => {
      expect(treedux['storeInstance']).toBeDefined();
      expect(treedux['dataStores']).toBe(dataStores);
      expect(treedux['hooks']).toBe(options.hooks);
    });
    
    it("sets treedux instance on each data store", () => {
      expect(testDataStore.setTreedux).toHaveBeenCalledTimes(1);
      expect(testDataStore.setTreedux).toHaveBeenCalledWith(treedux);
      expect(testDataStore2.setTreedux).toHaveBeenCalledTimes(1);
      expect(testDataStore2.setTreedux).toHaveBeenCalledWith(treedux);
    });
    
    it("sets hooks on each data store", () => {
      expect(testDataStore.setHooks).toHaveBeenCalledTimes(1);
      expect(testDataStore.setHooks).toHaveBeenCalledWith(options.hooks);
      expect(testDataStore2.setHooks).toHaveBeenCalledTimes(1);
      expect(testDataStore2.setHooks).toHaveBeenCalledWith(options.hooks);
    });
    
    it("sets up redux reducers correctly", () => {
      expect(createReducer).toHaveBeenCalledTimes(2);
      expect(createReducer).toHaveBeenCalledWith({ testInitialState: true }, expect.any(Function));
      
      const builderMock = { addCase: jest.fn() };
      const testReducerFunction: Function = createReducer['mock'].calls[0][1];
      testReducerFunction(builderMock);
      expect(builderMock.addCase).toHaveBeenCalledTimes(1);
      
      const test2ReducerFunction: Function = createReducer['mock'].calls[1][1];
      test2ReducerFunction(builderMock);
      expect(builderMock.addCase).toHaveBeenCalledTimes(2);
      
      
      expect(createReducer).toHaveBeenCalledWith({ test2InitialState: true }, expect.any(Function));
      expect(combineReducers).toHaveBeenCalledTimes(1);
      expect(combineReducers).toHaveBeenCalledWith({
        'testDataStore': { reducer: true },
        'testDataStore2': { reducer: true }
      });
    });
    
    it("calls configureStore with correct arguments", () => {
      expect(configureStore).toHaveBeenCalledTimes(1);
    });
    
    it("can be instantiated with options", () => {
      const treedux = new TestTreedux(dataStores);
      expect(treedux['storeInstance']).toBeDefined();
    });
    
  });
  
  describe("init", () => {
    
    let treedux: any;
    
    beforeEach(() => {
      treedux = Treedux.init({});
    });
    
    it("returns a Treedux instance", () => {
      expect(treedux).toBeInstanceOf(Treedux);
    });
    
  });
  
  describe("state", () => {
    
    let treedux: any;
    
    beforeEach(() => {
      
      const dataStores: any = {
        test: {
          get state() {
            return { testState: true };
          },
          setTreedux: jest.fn(),
          setHooks: jest.fn(),
          getInitialState: jest.fn().mockReturnValue({ testInitialState: true }),
          getReducers: jest.fn()
        },
        test2: {
          get state() {
            return { testState2: true };
          },
          setTreedux: jest.fn(),
          setHooks: jest.fn(),
          getInitialState: jest.fn().mockReturnValue({ test2InitialState: true }),
          getReducers: jest.fn()
        }
      };
      
      treedux = new TestTreedux(dataStores);
    });
    
    it("throws error if store not initialised", () => {
      treedux['storeInstance'] = null;
      expect(() => treedux.state).toThrow("Cannot get store. Redux store has not been initialized.");
    });
    
    it("returns state from all data stores", () => {
      treedux['storeInstance'] = { store: true };
      treedux['dataStores'] = {
        'testDataStore': {
          state: { testState: true }
        },
        'testDataStore2': {
          state: { testState2: true }
        }
      };
      
      expect(treedux.state).toEqual({
        'testDataStore': { testState: true },
        'testDataStore2': { testState2: true }
      });
    });
  });
  
  describe("getState", () => {
    
    let treedux: any;
    
    beforeEach(() => {
      treedux = new TestTreedux({});
    });
    
    it("throws error if store not initialised", () => {
      treedux['storeInstance'] = null;
      expect(() => treedux.getState()).toThrow("Cannot get state. Redux store has not been initialized.");
    });
    
    it("calls getState on store instance", () => {
      treedux['storeInstance'] = { getState: jest.fn().mockReturnValue({ test: true }) };
      expect(treedux.getState()).toEqual({ test: true });
    });
    
    it("returns result of store instance getState", () => {
      treedux['storeInstance'] = { getState: jest.fn().mockReturnValue({ test: true }) };
      expect(treedux.getState()).toEqual({ test: true });
    });
  });
  
  describe("subscribe", () => {
    
    let treedux: any;
    
    beforeEach(() => {
      treedux = new TestTreedux({});
    });
    
    it("throws error if store not initialised", () => {
      treedux['storeInstance'] = null;
      expect(() => treedux.subscribe(() => {})).toThrow("Cannot subscribe to store. Redux store has not been initialized.");
    });
    
    it("calls subscribe on store instance", () => {
      const listener = jest.fn();
      treedux['storeInstance'] = { subscribe: jest.fn() };
      treedux.subscribe(listener);
      expect(treedux['storeInstance'].subscribe).toHaveBeenCalledTimes(1);
      expect(treedux['storeInstance'].subscribe).toHaveBeenCalledWith(listener);
    });
  });
  
  describe("dispatch", () => {
    
    let treedux: any;
    
    beforeEach(() => {
      treedux = new TestTreedux({});
    });
    
    it("throws error if store not initialised", () => {
      treedux['storeInstance'] = null;
      expect(() => treedux.dispatch()).toThrow("Cannot dispatch action. Redux store has not been initialized.");
    });
    
    it("calls dispatch on store instance", () => {
      const action = { serialize: jest.fn().mockReturnValue({ type: 'testAction' }) };
      treedux['storeInstance'] = { dispatch: jest.fn() };
      treedux.dispatch(action);
      expect(treedux['storeInstance'].dispatch).toHaveBeenCalledTimes(1);
      expect(treedux['storeInstance'].dispatch).toHaveBeenCalledWith({
        type: '__BATCH__',
        payload: [ { type: 'testAction' } ]
      });
    });
  
  });

});
