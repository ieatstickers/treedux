import { Unsubscribe } from "@reduxjs/toolkit";
import { Action } from "./Data/Action";
import { DefaultDataStoreMap } from "./Type/DefaultDataStoreMap";
import { NodeCache } from "./Data/NodeCache";
export declare const NODE_CACHE: unique symbol;
export declare const READ_ONLY_NODE_CACHE: unique symbol;
export declare class Treedux<DataStoreMap extends DefaultDataStoreMap = DefaultDataStoreMap> {
    private readonly storeInstance;
    private readonly dataStores;
    private readonly subscribers;
    private readonly nodeCache;
    private readonly readOnlyNodeCache;
    protected constructor(dataStores: DataStoreMap, options?: {
        initialState?: any;
    });
    static init<DataStoreMap extends DefaultDataStoreMap>(dataStores: DataStoreMap, options?: {
        initialState?: any;
    }): Treedux<DataStoreMap>;
    get state(): {
        [K in keyof DataStoreMap]: DataStoreMap[K]["state"];
    };
    getState(): any;
    subscribe(subscriber: () => void): Unsubscribe;
    dispatch(...actions: Array<Action<any>>): void;
    protected notifySubscribers(): void;
    get [NODE_CACHE](): NodeCache;
    get [READ_ONLY_NODE_CACHE](): NodeCache;
}
