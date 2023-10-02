import { Unsubscribe } from "@reduxjs/toolkit";
import { Action } from "./Data/Action";
import { DataStore } from "./Data/DataStore";
type DefaultDataStoreMap = {
    [key: string]: DataStore<any, any>;
};
export declare class Treedux<DataStoreMap extends DefaultDataStoreMap = DefaultDataStoreMap> {
    private dataStores;
    private storeInstance;
    protected constructor(dataStores: DataStoreMap, options?: {
        initialState?: any;
    });
    static init<DataStoreMap extends DefaultDataStoreMap>(dataStores: DataStoreMap, options?: {
        initialState?: any;
    }): Treedux<DataStoreMap>;
    get state(): {
        [K in keyof DataStoreMap]: DataStoreMap[K]['state'];
    };
    getState(): any;
    subscribe(callback: () => void): Unsubscribe;
    dispatch(...actions: Array<Action<any>>): void;
}
export {};
