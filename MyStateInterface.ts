// Example state structure
export type MyStateInterface = {
  a: {
    b: {
      c: string
    },
    d: string,
    e: Array<number>
  },
  f: number
}

type B = A;  // Error: Cannot find name 'A'.
type A = number;

let b: B;
