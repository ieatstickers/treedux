// Your basic methods for each state node
import { Action } from "./src/Data/Action";

interface StateNodeInterface<Type>
{
  get(): Type,
  set(value: Type): Action<{ keyPath: Array<string>, value: Type }>
  subscribe(callback: (data: Type) => void): () => void,
  use(): { value: Type, set: (value: Type) => Action<{ keyPath: Array<string>, value: Type }> }
}

// Overrides type definition
export type MutatorCreators<Type> = {
  [K in keyof Type]?: Type[K] extends Record<string, any> // TODO: Replace with IsPOJO
    ? MutatorCreators<Type[K]>
    : { [key: string]: (...args: Array<any>) => any } // TODO: Replace with MutatorCreator type (needs to be added)
} | { [key: string]: (...args: Array<any>) => any } // TODO: Replace with MutatorCreator type (needs to be added)

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
      add: (amount: number) => {},
      subtract: (amount: number) => {}
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
e.add(123); // This errors (which is expected)
e.subtract(23);
