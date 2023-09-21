import { CreateSliceOptions } from "@reduxjs/toolkit/src/createSlice";
import { Treedux } from "../Treedux";
import { StateNode } from "./StateNode";
import { MutatorCreators } from "../Type/MutatorCreators";
import { RecursiveStateNode } from "../Type/RecursiveStateNode";
import { MutatorInterface } from "./MutatorInterface";

interface DataStoreOptions<State, Mutators extends MutatorCreators<State, State>>
{
  initialState: State;
  mutators?: Mutators;
}

export class DataStore<StateInterface, Mutators extends MutatorCreators<StateInterface, StateInterface> = MutatorCreators<StateInterface, StateInterface>>
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
  
  public static create<StateInterface, Mutators extends MutatorCreators<StateInterface, StateInterface> = MutatorCreators<StateInterface, StateInterface>>(
    key: string,
    options: DataStoreOptions<StateInterface, Mutators>,
  ): DataStore<StateInterface, Mutators>
  {
    return new DataStore<StateInterface, Mutators>(key, options);
  }
  
  public get state(): RecursiveStateNode<StateInterface, StateInterface, Mutators>
  {
    const options = { keyPath: [this.KEY], mutators: this.mutators };
    return StateNode.create<StateInterface, StateInterface, typeof options>(options, this.treedux);
  }
  
  public setTreedux(treedux: Treedux): this
  {
    this.treedux = treedux;
    return this;
  }
  
  public getInitialState(): StateInterface
  {
    return this.initialState;
  }
  
  public getReducers() // TODO: Add return type
  {
    return this.getReducerMap(this.mutators);
  }
  
  private getReducerMap(mutators: Mutators) // TODO: Add return type
  {
    // @ts-ignore // TODO: Fix this
    return this.hydrateReducers(mutators, {})
  }
  
  private hydrateReducers(
    mutators: MutatorCreators<any, StateInterface>,
    reducerMap: { [actionType: string]: MutatorInterface<StateInterface>['reduce'] }
  ) // TODO: Add return type
  {
    for (const key in mutators)
    {
      const mutatorCreator = mutators[key];
      
      if (typeof mutatorCreator === 'object')
      {
        this.hydrateReducers(mutatorCreator, reducerMap);
      }
      else
      {
        if (reducerMap[key]) throw `Cannot add reducer. Action type already registered: ${key}`;
        const mutator = mutatorCreator(this.treedux);
        reducerMap[mutator.getType()] = mutator.reduce;
      }
    }
    
    return reducerMap;
  }
}
