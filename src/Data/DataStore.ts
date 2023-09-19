import { CreateSliceOptions } from "@reduxjs/toolkit/src/createSlice";
import { Treedux } from "../Treedux";
import { StateNode } from "./StateNode";
import { MutatorCreators } from "../Type/MutatorCreators";

interface DataStoreOptions<State, Mutators extends MutatorCreators<State>>
{
  initialState: State;
  mutators?: Mutators;
}

export class DataStore<StateInterface, Mutators extends MutatorCreators<StateInterface> = MutatorCreators<StateInterface>>
{
  public readonly KEY: string;
  private readonly initialState: StateInterface;
  private readonly mutators: Mutators;
  private treedux: Treedux;
  
  public constructor(key: string, options: DataStoreOptions<StateInterface, Mutators>)
  {
    this.KEY = key;
    this.initialState = options.initialState;
    this.mutators = options.mutators;
  }
  
  public static create<StateInterface, Mutators extends MutatorCreators<StateInterface> = MutatorCreators<StateInterface>>(
    key: string,
    options: DataStoreOptions<StateInterface, Mutators>,
  ): DataStore<StateInterface, Mutators>
  {
    return new DataStore<StateInterface, Mutators>(key, options);
  }
  
  public get state()
  {
    const options = { keyPath: [this.KEY], mutators: this.mutators };
    return StateNode.create<StateInterface, typeof options>(options, this.treedux);
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
