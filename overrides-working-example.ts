// Your basic methods for each state node
import { Treedux } from "./src/Treedux";
import { Action } from "./src/Data/Action";
import { Action as ReduxAction } from "@reduxjs/toolkit";

interface StateNodeInterface<Type>
{
  get(): Type,
  set(value: Type): Action<{ keyPath: Array<string>, value: Type }>
  subscribe(callback: (data: Type) => void): () => void,
  use(): { value: Type, set: (value: Type) => Action<{ keyPath: Array<string>, value: Type }> }
}

interface MutatorInterface<State>
{
  getType(): string;
  getAction(...args: any): Action<State>;
  reduce(state: State, action: ReduxAction): State;
}

class Mutator<Type> implements MutatorInterface<Type>
{
  public getType(): string
  {
    return  'example/type';
  }
  
  public getAction(): Action<any>
  {
    return null;
  }
  
  public reduce(state: Type, action: ReduxAction): Type
  {
    return null;
  }
}

type IsPOJO<T> = T extends Record<string, any>
  ? (T extends any[] | ((...args: any[]) => any) | Date | RegExp ? false : true)
  : false;

type MutatorCreator<StateInterface> = (treedux: Treedux) => MutatorInterface<StateInterface>

export type MutatorCreators<Type> = { [key: string]: MutatorCreator<Type> }
  & IsPOJO<Type> extends true
    ? {
      [K in OwnKeys<Type>]?: MutatorCreators<Type[K]>
    }
    : { [key: string]: MutatorCreator<Type> }

type StateNodeWithMutatorCreators<StateNodeType, StateNodeMutatorCreators extends MutatorCreators<StateNodeType>> = StateNodeInterface<StateNodeType> & StateNodeMutatorCreators;

type DefaultKeys = keyof Object
  | keyof Array<any>
  | keyof Date
  | keyof RegExp
  | keyof string
  | keyof number
  | keyof boolean
  | keyof null
  | keyof undefined
  | keyof void
  | keyof symbol
  | keyof bigint;

type OwnKeys<T> = Exclude<keyof T, DefaultKeys>;

type RecursiveStateNode<StateNodeType, StateNodeMutatorCreators extends MutatorCreators<StateNodeType> = {}> =
  StateNodeWithMutatorCreators<StateNodeType, StateNodeMutatorCreators>
  & {
    // For each key in the POJO
    [K in OwnKeys<StateNodeType>]: RecursiveStateNode<StateNodeType[K], StateNodeMutatorCreators extends Record<K, any> ? StateNodeMutatorCreators[K] : {}>
  }
  
  
// EXAMPLE 1


const mutators = {
  a: {
    b: {
      c: {
        remove: () => new Mutator<string>(),
        tits: () => new Mutator<string>(),
      }
    }
  }
}

const node: RecursiveStateNode<MyStateInterface, typeof mutators> = null;


// EXAMPLE 2

// Your example overrides
const overrides = {
  a: {
    e: {
      add: () => new Mutator<Array<number>>(),
      remove: () => new Mutator<Array<number>>()
    }
  }
}

const getNode = (): RecursiveStateNode<MyStateInterface, typeof overrides> => {
  return null;
}

let stateNode = getNode();

stateNode.a.e.remove(); // TODO: THIS ONE

import { MyStateInterface } from "./MyStateInterface";

// const a = stateNode.a
// const b = stateNode.a.b
// const c = stateNode.a.b.c
// const d = stateNode.a.d
// const e = stateNode.a.e
// const f = stateNode.f.get()
//
//
// // const e = stateNode.a.e;
//
// // let eNumber = e.get();
// //
// // e.subscribe((eValue) => {
// //   console.log(`E has changed from ${eNumber} to ${eValue}`);
// //   eNumber = eValue;
// // })
//
//
//
// e.set([123]);
// e.add();
// e.remove();
