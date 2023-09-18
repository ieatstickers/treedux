import { combineReducers, configureStore, createSlice, Unsubscribe } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { Action } from "./Data/Action";
import { DataStore } from "./Data/DataStore";
import { DefaultActionEnum } from "./Enum/DefaultActionEnum";
import { Objects } from "./Utility/Objects";

// Default map of data store key to DataStore instance
type DefaultDataStoreMap = { [key: string]: DataStore<any> };

// Reducer map for Redux store
type ReducerMap<DataStoreMap extends DefaultDataStoreMap> = {
  [K in keyof DataStoreMap]: ReturnType<typeof createSlice>['reducer'];
};

export class Treedux<DataStoreMap extends DefaultDataStoreMap = DefaultDataStoreMap>
{
  private dataStores: DataStoreMap;
  private storeInstance: ToolkitStore;
  
  protected constructor(dataStores: DataStoreMap, options?: { initialState?: any })
  {
    this.dataStores = dataStores;
    options = options || {};
    const reducerMap: Partial<ReducerMap<DataStoreMap>> = {};
    
    // For each data store
    for (const key in this.dataStores)
    {
      // Get the data store instance
      const dataStore = this.dataStores[key];
      // Get the data store slice options
      const sliceOptions = dataStore.getSliceOptions();
      // Create the slice
      const slice = createSlice(sliceOptions);
      // Add reducer the reducer map
      reducerMap[key] = slice.reducer;
      // Set redux on the data store
      dataStore.setTreedux(this);
    }
    
    // Combine all data store reducers to create app reducer
    const appReducer = combineReducers(reducerMap);
    
    // Define root reducer
    const rootReducer = (state, action) => {
      
      if (action.type === DefaultActionEnum.BATCH)
      {
        return action.payload.reduce(rootReducer, state);
      }
      else if (action.type === DefaultActionEnum.SET_BY_KEY_PATH)
      {
        const {keyPath, value} = action.payload;
        return Objects.setByKeyPath(keyPath, value, state);
      }
      
      return appReducer(state, action);
    };
    
    this.storeInstance = configureStore({
      reducer: rootReducer,
      preloadedState: options.initialState
    });
  }
  
  public static init<DataStoreMap extends DefaultDataStoreMap>(
    dataStores: DataStoreMap,
    options?: { initialState?: any }
  ): Treedux<DataStoreMap>
  {
    return new Treedux(dataStores, options);
  }
  
  public get state(): { [K in keyof DataStoreMap]: DataStoreMap[K]['state'] }
  {
    if (!this.storeInstance) throw "Cannot get store. Redux store has not been initialized.";
    
    const storeObj: { [K in keyof DataStoreMap]?: DataStoreMap[K]['state'] } = {};
    
    for (const key in this.dataStores)
    {
      storeObj[key] = this.dataStores[key].state;
    }
    
    return storeObj as { [K in keyof DataStoreMap]: DataStoreMap[K]['state'] };
  }
  
  public getState(): any
  {
    if (!this.storeInstance) throw "Cannot get state. Redux store has not been initialized.";
    
    return this.storeInstance.getState();
  }
  
  public subscribe(callback: () => void): Unsubscribe
  {
    if (!this.storeInstance) throw "Cannot subscribe to store. Redux store has not been initialized.";
    return this.storeInstance.subscribe(callback);
  }
  
  public dispatch(...actions: Array<Action<any>>): void
  {
    if (!this.storeInstance) throw "Cannot dispatch action. Redux store has not been initialized.";
    
    if (actions.length === 1)
    {
      this.storeInstance.dispatch(actions[0].serialize());
    }
    
    this.storeInstance.dispatch({
      type: DefaultActionEnum.BATCH,
      payload: actions.map(action => action.serialize()),
    });
  }
}
