// Your basic methods for each state node
import { Action } from "./src/Data/Action";
import { Action as ReduxAction } from "@reduxjs/toolkit";
import { MyStateInterface } from "./MyStateInterface";

class Treedux {

}

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

  public getAction(test: string): Action<any>
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

export type MutatorCreators<Type, StateInterface> = { [key: string]: MutatorCreator<StateInterface> }
  & IsPOJO<Type> extends true
    ? {
      [K in OwnKeys<Type>]?: MutatorCreators<Type[K], StateInterface>
    }
    : { [key: string]: MutatorCreator<StateInterface> }

export type MutatorMethods<StateInterface, StateNodeMutatorCreators extends MutatorCreators<{}, StateInterface>> = IsPOJO<StateNodeMutatorCreators> extends true
  ? {
    [K in keyof StateNodeMutatorCreators]: StateNodeMutatorCreators[K] extends MutatorCreator<StateInterface>
      ? ReturnType<StateNodeMutatorCreators[K]>['getAction']
      : {}
  }
  : {}

type StateNodeWithMutators<StateNodeType, StateNodeMutatorMethods extends MutatorMethods<any, any>> = StateNodeInterface<StateNodeType> & StateNodeMutatorMethods;


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

type RecursiveStateNode<StateNodeType, StateInterface, StateNodeMutatorCreators extends MutatorCreators<StateNodeType, StateInterface> = {}> =
  StateNodeWithMutators<StateNodeType, MutatorMethods<StateInterface, StateNodeMutatorCreators>>
  & {
    // For each key in the POJO
    [K in OwnKeys<StateNodeType>]: RecursiveStateNode<StateNodeType[K], StateInterface, StateNodeMutatorCreators extends Record<K, any> ? StateNodeMutatorCreators[K] : {}>
  }


// EXAMPLE 1


const mutators = {
  a: {
    b: {
      c: {
        remove: (treedux: Treedux) => new Mutator<MyStateInterface>(),
        tits: (treedux: Treedux) => new Mutator<MyStateInterface>(),
      }
    }
  }
}

const node: RecursiveStateNode<MyStateInterface, MyStateInterface, typeof mutators> = null;

// EXAMPLE 2

// Your example overrides
const overrides = {
  tits: (treedux: Treedux) => new Mutator<MyStateInterface>(),
  a: {
    test: (treedux: Treedux) => new Mutator<MyStateInterface>(),
    e: {
      add: (treedux: Treedux) => new Mutator<MyStateInterface>(),
      remove: (treedux: Treedux) => new Mutator<MyStateInterface>()
    }
  }
}

const getNode = (): RecursiveStateNode<MyStateInterface, MyStateInterface, typeof overrides> => {
  return null;
}


function closedScope(node: RecursiveStateNode<MyStateInterface, MyStateInterface, typeof overrides>) {

}
let stateNode = getNode();


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
