import { CreateSliceOptions } from "@reduxjs/toolkit/src/createSlice";
import { Treedux } from "../Treedux";
import { StateNode } from "./StateNode";

interface DataStoreOptions<InitialStateInterface>
{
  initialState: InitialStateInterface;
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
    return StateNode.create<StateInterface>({keyPath: [this.KEY]}, this.treedux);
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
