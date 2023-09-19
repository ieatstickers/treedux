type StateNodeMethods<Type> = {
  get: () => Type,
  set: (value: Type) => void,
  subscribe: (callback: (data: Type) => void) => () => void
}

type MergeMethods<T, O> = O & StateNodeMethods<T>;

type RecursiveStateNode<Type, Override = {}> = {
  [K in keyof Type]: Type[K] extends Record<string, any>
    ? RecursiveStateNode<Type[K], Override extends Record<K, any> ? Override[K] : {}>
      & MergeMethods<Type[K], Override extends Record<K, any> ? Override[K] : {}>
    : StateNodeMethods<Type[K]>
}


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

e.subscribe((e) => {
  console.log(`E has changed from ${eNumber} to ${e}`);
  eNumber = e;
})

e.set(123); // You had a string here but it should be a number based on your state definition.

e.add(123);
e.subtract(23);
