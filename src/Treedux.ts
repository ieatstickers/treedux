import {
  combineReducers,
  configureStore,
  createReducer,
  createSlice,
  EnhancedStore,
  Unsubscribe
} from "@reduxjs/toolkit";
import { Action } from "./Data/Action";
import { DefaultActionEnum } from "./Enum/default-action-enum";
import { Objects } from "./utility/objects";
import { DefaultDataStoreMap } from "./Type/DefaultDataStoreMap";
import { NodeCache } from "./Data/NodeCache";

// Reducer map for Redux store
type ReducerMap<DataStoreMap extends DefaultDataStoreMap> = {
  [K in keyof DataStoreMap]: ReturnType<typeof createSlice>["reducer"];
};

export const NODE_CACHE = Symbol("treedux.node_cache");
export const READ_ONLY_NODE_CACHE = Symbol("treedux.read_only_node_cache");

export class Treedux<DataStoreMap extends DefaultDataStoreMap = DefaultDataStoreMap>
{
  private readonly storeInstance: EnhancedStore;
  private readonly dataStores: DataStoreMap;
  private readonly subscribers: Set<() => void> = new Set();
  private readonly nodeCache: NodeCache;
  private readonly readOnlyNodeCache: NodeCache;

  protected constructor(
    dataStores: DataStoreMap,
    options?: {
      initialState?: any,
    }
  )
  {
    this.dataStores = dataStores;
    this.nodeCache = new NodeCache();
    this.readOnlyNodeCache = new NodeCache();
    options = options || {};
    const reducerMap: Partial<ReducerMap<DataStoreMap>> = {};

    // For each data store
    for (const key in this.dataStores)
    {
      // Get the data store instance
      const dataStore = this.dataStores[key];
      // Set redux on the data store
      dataStore.setTreedux(this);
      // Add reducer the reducer maps
      reducerMap[key] = createReducer(dataStore.getInitialState(), (builder) => {
        Object.entries(dataStore.getReducers())
          .forEach(([ actionType, reducer ]) => builder.addCase(actionType, reducer));
      });
    }

    // Combine all data store reducers to create app reducer
    const appReducer = combineReducers(reducerMap);

    // Define root reducer
    const rootReducer = (state: any, action: any) => {

      if (action.type === DefaultActionEnum.BATCH)
      {
        return action.payload.reduce(rootReducer, state);
      }
      else if (action.type === DefaultActionEnum.SET_BY_KEY_PATH)
      {
        const { keyPath, value } = action.payload;
        return Objects.setByKeyPath(keyPath, value, state);
      }
      else if (action.type === DefaultActionEnum.DELETE_BY_KEY_PATH)
      {
        const { keyPath } = action.payload;
        return Objects.setByKeyPath(keyPath, undefined, state);
      }

      return appReducer(state, action);
    };

    this.storeInstance = configureStore({
      reducer: rootReducer,
      preloadedState: options.initialState
    });

    this.storeInstance.subscribe(() => this.notifySubscribers());
  }

  public static init<DataStoreMap extends DefaultDataStoreMap>(
    dataStores: DataStoreMap,
    options?: { initialState?: any }
  ): Treedux<DataStoreMap>
  {
    return new Treedux(dataStores, options);
  }

  public get state(): { [K in keyof DataStoreMap]: DataStoreMap[K]["state"] }
  {
    const storeObj: { [K in keyof DataStoreMap]?: DataStoreMap[K]["state"] } = {};

    for (const key in this.dataStores)
    {
      storeObj[key] = this.dataStores[key].state;
    }

    return storeObj as { [K in keyof DataStoreMap]: DataStoreMap[K]["state"] };
  }

  public getState(): any
  {
    return this.storeInstance.getState();
  }

  public subscribe(subscriber: () => void): Unsubscribe
  {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  public dispatch(...actions: Array<Action<any>>): void
  {
    this.storeInstance.dispatch({
      type: DefaultActionEnum.BATCH,
      payload: actions.map(action => action.serialize())
    });
  }

  protected notifySubscribers(): void
  {
    this.subscribers.forEach(subscriber => subscriber());
  }

  public get [NODE_CACHE](): NodeCache
  {
    return this.nodeCache;
  }

  public get [READ_ONLY_NODE_CACHE](): NodeCache
  {
    return this.readOnlyNodeCache;
  }
}
