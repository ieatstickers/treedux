import { Unsubscribe } from "@reduxjs/toolkit";
import { Action } from "./Data/Action";
import { DataStore } from "./Data/DataStore";
import { Hooks } from "./Type/Hooks";
type DefaultDataStoreMap = {
    [key: string]: DataStore<any, any>;
};
export declare class Treedux<DataStoreMap extends DefaultDataStoreMap = DefaultDataStoreMap> {
    private readonly storeInstance;
    private readonly dataStores;
    private readonly hooks;
    protected constructor(dataStores: DataStoreMap, options?: {
        initialState?: any;
        hooks?: Hooks;
    });
    static init<DataStoreMap extends DefaultDataStoreMap>(dataStores: DataStoreMap, options?: {
        initialState?: any;
        hooks?: Hooks;
    }): Treedux<DataStoreMap>;
    get state(): {
        [K in keyof DataStoreMap]: DataStoreMap[K]['state'];
    };
    getState(): any;
    subscribe(listener: () => void): Unsubscribe;
    dispatch(...actions: Array<Action<any>>): void;
}
export {};
