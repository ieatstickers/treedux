import { Unsubscribe } from "@reduxjs/toolkit";
import { Action } from "./Data/Action";
import { DefaultDataStoreMap } from "./Type/DefaultDataStoreMap";
export declare class Treedux<DataStoreMap extends DefaultDataStoreMap = DefaultDataStoreMap> {
    private readonly storeInstance;
    private readonly dataStores;
    private readonly subscribers;
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
}
