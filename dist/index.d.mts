import { Unsubscribe } from "@reduxjs/toolkit";

//#region src/Data/Action.d.ts
declare class Action<Payload> {
  private readonly treedux;
  readonly type: string;
  readonly payload: Payload;
  private constructor();
  static create<Payload>(action: {
    type: string;
    payload?: Payload;
  }, treedux: Treedux): Action<Payload>;
  dispatch(): void;
  serialize(): {
    type: string;
    payload: Payload;
  };
}
//#endregion
//#region src/Data/MutatorInterface.d.ts
interface MutatorInterface<State, Payload = any> {
  getType(): string;
  getAction(...args: any): Action<Payload>;
  reduce(state: State, action: ReturnType<Action<Payload>["serialize"]>): void;
}
//#endregion
//#region src/Type/MutatorCreator.d.ts
type MutatorCreator<StateInterface> = (treedux: Treedux) => MutatorInterface<StateInterface>;
//#endregion
//#region src/Type/IsPojo.d.ts
type IsPOJO<T> = T extends Record<string, any> ? (T extends any[] | ((...args: any[]) => any) | Date | RegExp ? false : true) : false;
//#endregion
//#region src/Type/OwnKeys.d.ts
type DefaultKeys = keyof Object | keyof Array<any> | keyof Date | keyof RegExp | keyof string | keyof number | keyof boolean | keyof null | keyof undefined | keyof void | keyof symbol | keyof bigint;
type OwnKeys<T> = Exclude<keyof T, DefaultKeys>;
//#endregion
//#region src/Type/MutatorCreators.d.ts
type MutatorCreators<Type, StateInterface> = {
  [key: string]: MutatorCreator<StateInterface>;
} & IsPOJO<Type> extends true ? { [K in OwnKeys<Type>]?: MutatorCreators<Type[K], StateInterface> | MutatorCreator<StateInterface> } : {
  [key: string]: MutatorCreator<StateInterface>;
};
//#endregion
//#region src/Type/IsPrimitive.d.ts
type IsPrimitive<T> = T extends string | number | boolean | bigint | symbol | undefined | null ? true : false;
//#endregion
//#region src/Type/ReadOnlyStateNodeInterface.d.ts
interface ReadOnlyStateNodeInterface<Type> {
  get(): Type;
  subscribe(callback: (data: Type) => void): () => void;
}
//#endregion
//#region src/Type/ObjectKeys.d.ts
type ObjectKeys<T> = IsPrimitive<T> extends true ? void : keyof T extends infer K ? string extends K ? string : K : never;
//#endregion
//#region src/Type/ObjectPropertyType.d.ts
type ObjectPropertyType<T, K> = IsPrimitive<T> extends true ? void : K extends keyof T ? T[K] : K extends string ? string extends keyof T ? T[string] : never : K extends number ? number extends keyof T ? T[number] : never : never;
//#endregion
//#region src/Type/ReadOnlyDynamicallyTraversable.d.ts
type ReadOnlyDynamicallyTraversable<StateNodeType, StateInterface> = {
  byKey<K extends ObjectKeys<StateNodeType>>(key: K): ReadOnlyRecursiveStateNode<ObjectPropertyType<StateNodeType, K>, StateInterface>;
};
//#endregion
//#region src/Type/ReadOnlyRecursiveStateNode.d.ts
type ReadOnlyRecursiveStateNode<StateNodeType, StateInterface> = ReadOnlyStateNodeInterface<StateNodeType> & (IsPrimitive<StateNodeType> extends true ? {} : ReadOnlyDynamicallyTraversable<NonNullable<StateNodeType>, StateInterface>) & { [K in OwnKeys<NonNullable<StateNodeType>>]: ReadOnlyRecursiveStateNode<NonNullable<StateNodeType>[K], StateInterface> };
//#endregion
//#region src/Type/StateNodeInterface.d.ts
interface StateNodeInterface<Type, StateInterface> {
  get(): Type;
  set(value: Type): Action<{
    keyPath: Array<string>;
    value: Type;
  }>;
  subscribe(callback: (data: Type) => void): () => void;
  toReadOnly(): ReadOnlyRecursiveStateNode<Type, StateInterface>;
}
//#endregion
//#region src/Type/MutatorMethods.d.ts
type MutatorMethods<StateInterface, StateNodeMutatorCreators extends MutatorCreators<{}, StateInterface> | undefined> = IsPOJO<StateNodeMutatorCreators> extends true ? { [K in keyof StateNodeMutatorCreators]: StateNodeMutatorCreators[K] extends MutatorCreator<StateInterface> ? ReturnType<StateNodeMutatorCreators[K]>["getAction"] : {} } : {};
//#endregion
//#region src/Type/StateNodeWithMutators.d.ts
type StateNodeWithMutators<StateNodeType, StateInterface, StateNodeMutatorMethods extends MutatorMethods<any, any> | undefined> = StateNodeInterface<StateNodeType, StateInterface> & StateNodeMutatorMethods;
//#endregion
//#region src/Type/ExtractMutatorCreators.d.ts
type ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K> = K extends keyof StateNodeMutatorCreators ? StateNodeMutatorCreators[K] extends MutatorCreators<ObjectPropertyType<StateNodeType, K>, StateInterface> ? StateNodeMutatorCreators[K] : {} : {};
//#endregion
//#region src/Type/DynamicallyTraversable.d.ts
type DynamicallyTraversable<StateNodeType, StateInterface, StateNodeMutatorCreators> = {
  byKey<K extends ObjectKeys<StateNodeType>>(key: K): RecursiveStateNode<ObjectPropertyType<StateNodeType, K>, StateNodeType, StateInterface, ExtractMutatorCreators<StateNodeType, StateInterface, StateNodeMutatorCreators, K>>;
};
//#endregion
//#region src/Type/Deletable.d.ts
type Deletable = {
  delete(): Action<{
    keyPath: Array<string>;
  }>;
};
//#endregion
//#region src/Type/RecursiveStateNode.d.ts
type RecursiveStateNode<StateNodeType, ParentStateNodeType, StateInterface, StateNodeMutatorCreators extends MutatorCreators<StateNodeType, StateInterface> | undefined = {}> = StateNodeWithMutators<StateNodeType, StateInterface, MutatorMethods<StateInterface, StateNodeMutatorCreators>> & (IsPrimitive<StateNodeType> extends true ? {} : DynamicallyTraversable<NonNullable<StateNodeType>, StateInterface, StateNodeMutatorCreators>) & (string extends keyof ParentStateNodeType ? Deletable : number extends keyof ParentStateNodeType ? Deletable : {}) & { [K in OwnKeys<NonNullable<StateNodeType>>]: RecursiveStateNode<NonNullable<StateNodeType>[K], StateNodeType, StateInterface, ExtractMutatorCreators<NonNullable<StateNodeType>, StateInterface, StateNodeMutatorCreators, K> extends MutatorCreators<NonNullable<StateNodeType>[K], StateInterface> ? ExtractMutatorCreators<NonNullable<StateNodeType>, StateInterface, StateNodeMutatorCreators, K> : MutatorCreators<NonNullable<StateNodeType>[K], StateInterface>> };
//#endregion
//#region src/Data/DataStore.d.ts
interface DataStoreOptions<State, Mutators extends MutatorCreators<State, State>> {
  initialState: State;
  mutators?: Mutators;
}
declare class DataStore<StateInterface, Mutators extends MutatorCreators<StateInterface, StateInterface> = MutatorCreators<StateInterface, StateInterface>> {
  readonly KEY: string;
  private readonly initialState;
  private readonly mutators;
  private treedux;
  constructor(key: string, options: DataStoreOptions<StateInterface, Mutators>);
  static create<StateInterface, Mutators extends MutatorCreators<StateInterface, StateInterface> = MutatorCreators<StateInterface, StateInterface>>(key: string, options: DataStoreOptions<StateInterface, Mutators>): DataStore<StateInterface, Mutators>;
  get state(): RecursiveStateNode<StateInterface, {}, StateInterface, Mutators>;
  setTreedux(treedux: Treedux): this;
  getInitialState(): StateInterface;
  getReducers(): {
    [actionType: string]: MutatorInterface<StateInterface>["reduce"];
  };
  private hydrateReducersFromMutators;
}
//#endregion
//#region src/Type/DefaultDataStoreMap.d.ts
type DefaultDataStoreMap = {
  [key: string]: DataStore<any, any>;
};
//#endregion
//#region src/Data/NodeCache.d.ts
declare class NodeCache {
  private readonly cache;
  private readonly registry;
  get<T extends object>(keyPath: Array<string>): T | null;
  set<T extends object>(keyPath: Array<string>, value: T): void;
  private toKey;
}
//#endregion
//#region src/Treedux.d.ts
declare const NODE_CACHE: unique symbol;
declare const READ_ONLY_NODE_CACHE: unique symbol;
declare class Treedux<DataStoreMap extends DefaultDataStoreMap = DefaultDataStoreMap> {
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
  get state(): { [K in keyof DataStoreMap]: DataStoreMap[K]["state"] };
  getState(): any;
  subscribe(subscriber: () => void): Unsubscribe;
  dispatch(...actions: Array<Action<any>>): void;
  protected notifySubscribers(): void;
  get [NODE_CACHE](): NodeCache;
  get [READ_ONLY_NODE_CACHE](): NodeCache;
}
//#endregion
//#region src/Data/AbstractMutator.d.ts
declare abstract class AbstractMutator<State, Payload = any> implements MutatorInterface<State, Payload> {
  protected treedux: Treedux;
  constructor(treedux: Treedux);
  abstract getType(): string;
  abstract getAction(...args: any): Action<Payload>;
  abstract reduce(state: State, action: ReturnType<Action<Payload>["serialize"]>): void;
}
//#endregion
//#region src/Data/StateNode.d.ts
type StateNodeOptions<T, StateInterface> = {
  keyPath: Array<string>;
  mutators?: MutatorCreators<T, StateInterface>;
};
declare class StateNode<StateNodeType, ParentStateNodeType, StateInterface, Options extends StateNodeOptions<StateNodeType, StateInterface> = StateNodeOptions<StateNodeType, StateInterface>> implements StateNodeInterface<StateNodeType, StateInterface> {
  private readonly treedux;
  private lastKnownValue;
  private readonly keyPath;
  private readonly mutators;
  protected constructor(options: StateNodeOptions<StateNodeType, StateInterface>, treedux: Treedux);
  static create<StateNodeType, ParentStateNodeType, StateInterface, Options extends StateNodeOptions<StateNodeType, StateInterface> = StateNodeOptions<StateNodeType, StateInterface>>(options: StateNodeOptions<StateNodeType, StateInterface>, treedux: Treedux): RecursiveStateNode<StateNodeType, ParentStateNodeType, StateInterface, Options["mutators"]>;
  get(): StateNodeType;
  set(value: StateNodeType): Action<{
    keyPath: Array<string>;
    value: StateNodeType;
  }>;
  subscribe(callback: (data: StateNodeType) => void): () => void;
  byKey<K extends ObjectKeys<StateNodeType>>(key: K): RecursiveStateNode<ObjectPropertyType<StateNodeType, K>, StateNodeType, StateInterface, K extends keyof Options["mutators"] ? Options["mutators"][K] extends MutatorCreators<ObjectPropertyType<StateNodeType, K>, StateInterface> ? Options["mutators"][K] : {} : {}>;
  delete(): Action<{
    keyPath: Array<string>;
  }>;
  toReadOnly(): ReadOnlyRecursiveStateNode<StateNodeType, StateInterface>;
  private createProxy;
  private getMutatorMethod;
}
//#endregion
//#region src/Enum/DefaultActionEnum.d.ts
declare enum DefaultActionEnum {
  BATCH = "__BATCH__",
  SET_BY_KEY_PATH = "__SET_BY_KEY_PATH__",
  DELETE_BY_KEY_PATH = "__DELETE_BY_KEY_PATH__"
}
//#endregion
export { AbstractMutator, Action, DataStore, DefaultActionEnum, type DefaultDataStoreMap, type MutatorCreator, type ReadOnlyRecursiveStateNode, type ReadOnlyStateNodeInterface, type RecursiveStateNode, StateNode, type StateNodeInterface, Treedux };