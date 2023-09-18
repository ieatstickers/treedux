import { CreateSliceOptions } from "@reduxjs/toolkit/src/createSlice";
import { Treedux } from "../Treedux";
import { StateNode } from "./StateNode";
import { IsPOJO } from "../Type/IsPojo";
import { MutatorCreator } from "../Type/MutatorCreator";

type Mutators<NodeType, State> = {
  // For each key
  [K in keyof NodeType]?: IsPOJO<NodeType[K]> extends true
    // If type of value is a plain JS object, recurse
    ? Mutators<NodeType[K], State> | { [key: string]: MutatorCreator<State> }
    // If type of value is not a plain JS object, can be an map of mutators
    : { [key: string]: MutatorCreator<State> }
}

interface DataStoreOptions<State>
{
  initialState: State;
  mutators?: Mutators<State, State>;
}

export class DataStore<StateInterface>
{
  public readonly KEY: string;
  private readonly initialState: StateInterface;
  private treedux: Treedux;
  
  public constructor(key: string, options: DataStoreOptions<StateInterface>)
  {
    this.KEY = key;
    this.initialState = options.initialState;
  }
  
  public static create<StateInterface>(
    key: string,
    options: DataStoreOptions<StateInterface>,
  ): DataStore<StateInterface>
  {
    return new DataStore<StateInterface>(key, options);
  }
  
  public get state()
  {
    return StateNode.create<StateInterface>({ keyPath: [this.KEY] }, this.treedux);
  }
  
  public setTreedux(treedux: Treedux): this
  {
    this.treedux = treedux;
    return this;
  }
  
  public getSliceOptions(): CreateSliceOptions<any, any, any>
  {
    return {
      name: this.KEY,
      initialState: this.initialState,
      reducers: {}
    }
  }
}
