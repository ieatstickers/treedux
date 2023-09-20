// Your basic methods for each state node
import { Treedux } from "./src/Treedux";
import { Action } from "./src/Data/Action";

interface StateNodeInterface<Type>
{
  get(): Type,
  set(value: Type): Action<{ keyPath: Array<string>, value: Type }>
  subscribe(callback: (data: Type) => void): () => void,
  use(): { value: Type, set: (value: Type) => Action<{ keyPath: Array<string>, value: Type }> }
}

interface MutatorInterface<State>
{
  // getType(): string;
  // getAction(...args: any): Action<any>;
  // reduce(state: State, action: ReduxAction): State;
}

class Mutator<Type> implements MutatorInterface<Type>
{
  public test(): string
  {
    return  'test';
  }
}

type IsPOJO<T> = T extends Record<string, any>
  ? true// (T extends any[] | ((...args: any[]) => any) | Date | RegExp ? false : true)
  : false;

type MutatorCreator<StateInterface> = (treedux: Treedux) => MutatorInterface<StateInterface>

// Overrides type definition
export type MutatorCreators<Type> = {
  [K in keyof Type]?: Type[K] extends Record<string, any> // TODO: Replace with IsPOJO
    ? MutatorCreators<Type[K]>
    : { [key: string]: MutatorCreator<Type[K]> }
} | { [key: string]: MutatorCreator<Type> }

// Helper type to merge StateNodeMethods with any Overrides
type StateNodeWithMutatorCreators<StateNodeType, StateNodeMutatorCreators extends MutatorCreators<StateNodeType>> = StateNodeInterface<StateNodeType> & StateNodeMutatorCreators;

// Recursive type to generate the structure of your state tree with type-hinted methods
type RecursiveStateNode<StateNodeType, StateNodeMutatorCreators extends MutatorCreators<StateNodeType> = {}> = {
  [K in keyof StateNodeType]: StateNodeType[K] extends Record<string, any> // TODO: Replace with IsPOJO
    ? RecursiveStateNode<StateNodeType[K], K extends keyof StateNodeMutatorCreators ? StateNodeMutatorCreators[K] : {}>
    & StateNodeWithMutatorCreators<StateNodeType[K], K extends keyof StateNodeMutatorCreators ? StateNodeMutatorCreators[K] : {}>
    : StateNodeInterface<StateNodeType[K]>
}

// Example state structure
interface StateInterface {
  a: {
    b: {
      c: string
    },
    d: string,
    e: number
  },
  f: number
}

// Your example overrides
const overrides = {
  a: {
    e: {
      add: () => new Mutator<number>(),
      remove: () => new Mutator<number>()
    }
  }
}

let stateNode: RecursiveStateNode<StateInterface, typeof overrides>;

const e = stateNode.a.e;

let eNumber = e.get();

e.subscribe((eValue) => {
  console.log(`E has changed from ${eNumber} to ${eValue}`);
  eNumber = eValue;
})

e.set(123);
e.add();
e.remove();
