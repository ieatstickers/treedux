// Your basic methods for each state node
import { Action } from "./src/Data/Action";

type StateNodeMethods<Type> = {
  get(): Type,
  set(value: Type): void,
  subscribe(callback: (data: Type) => void): () => void,
  use(): { value: Type, set: (value: Type) => Action<{ keyPath: Array<string>, value: Type }> }
}

// Overrides type definition
export type Overrides<Type> = {
  [K in keyof Type]?: Type[K] extends Record<string, any>
    ? Overrides<Type[K]>
    : { [key: string]: (...args: Array<any>) => any }
} | { [key: string]: (...args: Array<any>) => any }

// Helper type to merge StateNodeMethods with any Overrides
type MergeMethods<T, O extends Overrides<T>> = O & StateNodeMethods<T>;

// Recursive type to generate the structure of your state tree with type-hinted methods
type RecursiveStateNode<Type, Override extends Overrides<Type> = {}> = {
  [K in keyof Type]: Type[K] extends Record<string, any>
    ? RecursiveStateNode<Type[K], K extends keyof Override ? Override[K] : {}>
    & MergeMethods<Type[K], K extends keyof Override ? Override[K] : {}>
    : StateNodeMethods<Type[K]>
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
