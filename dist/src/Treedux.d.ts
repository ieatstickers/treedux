import { Unsubscribe } from "@reduxjs/toolkit";
import { Action } from "./Data/Action";
import { Hooks } from "./Type/Hooks";
import { DefaultDataStoreMap } from "./Type/DefaultDataStoreMap";
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
