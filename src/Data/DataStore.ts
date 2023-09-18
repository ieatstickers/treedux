import { CreateSliceOptions } from "@reduxjs/toolkit/src/createSlice";
import { Treedux } from "../Treedux";
import { StateNode } from "./StateNode";
import { MutatorInterface } from "./MutatorInterface";

// SINGLE LEVEL WORKING START
//
// const myObject = {
//   a: "a",
//   b: "b",
//   c: "c"
// }
//
// type KnownKeys<ObjectType> = {
//   [K in keyof ObjectType]: boolean
// }
//
// type UnknownKeys<ObjectType> = {
//   [K in keyof any]: K extends keyof ObjectType ? never : number
// }
//
// type ObjectOptions<ObjectType> = KnownKeys<ObjectType> & UnknownKeys<ObjectType>;
//
// const myObjectOptions: ObjectOptions<typeof myObject> = {
//   a: true, // valid
//   b: true, // valid
//   c: false, // valid
//   d: 1, // valid
//   // e: "e", // This will give a type error, because "e" must be a number
//   // f: true // This will give a type error, because "f" must be a number
// }

// SINGLE LEVEL WORKING END

// NESTED LEVEL START (as close as possible so far to working)

// type KnownKeys<ObjectType> = {
//   [K in keyof ObjectType]: boolean
// }
//
// type UnknownKeys<ObjectType> = {
//   [K in keyof Record<string, unknown>]: K extends keyof ObjectType ? never : number
// }
//
// type ObjectOptions<ObjectType> = KnownKeys<ObjectType> & UnknownKeys<ObjectType>;
//
// type NestedObjectOptions<ObjectType> = {
//   [K in keyof ObjectType]: ObjectType[K] extends Record<string, unknown>
//     ? NestedObjectOptions<ObjectType[K]>
//     : K extends keyof ObjectType ? boolean : number
// };
//
// const myObject ={
//   a: "a",
//   b: "b",
//   c: "c",
//   d: {
//     e: "e"
//   }
// };
//
// const myObjectOptions: NestedObjectOptions<typeof myObject> = {
//   a: true,  // valid because a exists in the object above and the type of the value set here is a boolean
//   b: true,   // valid because b exists in the object above and the type of the value set here is a boolean
//   c: "string",  // not valid because c exists in the object above and the type of the value set here is not a boolean
//   d: {
//     e:   true,  // valid because d.e exists in the object above and the type of the value set here is a boolean
//     foo: 2   // valid because although d.foo doesn’t exist in myObject, its value is set to a number
//   },
//   e: "test"    //  not valid because e doesn’t exist in myObject and its value here is not set to a number
// };

// NESTED LEVEL END

// NESTED LEVEL v2 START

// type KnownKeys<ObjectType> = {
//   // For each known key in the object, if the value is an object, recurse, otherwise enforce value to boolean
//   [K in keyof ObjectType]?: ObjectType[K] extends Record<string, unknown> ? ObjectOptions<ObjectType[K]> | boolean : boolean
// }
//
// type UnknownKeys<ObjectType> = {
//   // For each unknown key in the object, if the value is an object, type for never (covered in KnownKets), otherwise enforce value to number
//   [K in keyof UnknownKeyNames<ObjectType>]?: number;
// };
//
// type UnknownKeyNames<ObjectType> = Omit<Record<string, unknown>, keyof ObjectType>;
//
//
// type ObjectOptions<ObjectType> = KnownKeys<ObjectType> | UnknownKeys<ObjectType>;
//
// const myObject ={
//   a: "a",
//   b: "b",
//   c: "c",
//   d: {
//     e: "e"
//   }
// };
//
// const myObjectOptions: ObjectOptions<typeof myObject> = {
//   a: true,  // valid because a exists in the object above and the type of the value set here is a boolean
//   b: false,   // valid because b exists in the object above and the type of the value set here is a boolean
//   c: true,  // NOT VALID because c exists in the object above and the type of the value set here is not a boolean
//   d: {
//     e:   123,  // valid because d.e exists in the object above and the type of the value set here is a boolean
//     // foo: 123   // valid because although d.foo doesn’t exist in myObject, its value is set to a number
//   },
//   e: 123    //  NOT VALID because e doesn’t exist in myObject and its value here is not set to a number
// };

// NESTED LEVEL v2 END

// // NESTED LEVEL v3 START

// type KnownKeys<ObjectType> = {
//   // For each known key in the object, if the value is an object, recurse, otherwise enforce value to boolean
//   [K in keyof ObjectType]?: ObjectType[K] extends Record<string, unknown> ? ObjectOptions<ObjectType[K]> | boolean : boolean
// }
//
// type UnknownKeys<ObjectType> = {
//   // For each unknown key in the object, if the value is an object, type for never (covered in KnownKets), otherwise enforce value to number
//   [K in keyof UnknownKeyNames<ObjectType>]?: number;
// };
//
// type UnknownKeyNames<ObjectType> = Omit<Record<string, unknown>, keyof ObjectType>;
//
//
// type ObjectOptions<ObjectType> = KnownKeys<ObjectType> | UnknownKeys<ObjectType>;
//
// const myObject ={
//   a: "a",
//   b: "b",
//   c: "c",
//   d: {
//     e: "e"
//   }
// };
//
// const myObjectOptions: ObjectOptions<typeof myObject> = {
//   a: true,  // valid because a exists in the object above and the type of the value set here is a boolean
//   b: false,   // valid because b exists in the object above and the type of the value set here is a boolean
//   c: true,  // NOT VALID because c exists in the object above and the type of the value set here is not a boolean
//   d: {
//     e:   123,  // valid because d.e exists in the object above and the type of the value set here is a boolean
//     foo: 123   // valid because although d.foo doesn’t exist in myObject, its value is set to a number
//   },
//   e: 123    //  NOT VALID because e doesn’t exist in myObject and its value here is not set to a number
// };

// NESTED LEVEL v3 END

// NESTED LEVEL v4 START

type KnownKeys<ObjectType> = {
  // For each known key in the object, if the value is an object, recurse, otherwise enforce value to boolean
  [K in keyof ObjectType]?: ObjectType[K] extends Record<string, unknown> ? ObjectOptions<ObjectType[K]> | boolean : boolean
}

type UnknownKeyNames<ObjectType> = Omit<Record<string, unknown>, keyof ObjectType>;

type UnknownKeys<ObjectType> = {
  // For each unknown key in the object, if the value is an object, type for never (covered in KnownKets), otherwise enforce value to number
  [K in keyof UnknownKeyNames<ObjectType>]?: number;
};

type ObjectOptions<ObjectType> = KnownKeys<ObjectType> | UnknownKeys<ObjectType>;

const myObject ={
  a: "a",
  b: "b",
  c: "c",
  d: {
    e: "e"
  }
};

const myObjectOptions: ObjectOptions<typeof myObject> = {
  a: true,  // valid because a exists in the object above and the type of the value set here is a boolean
  b: false,   // valid because b exists in the object above and the type of the value set here is a boolean
  c: true,  // NOT VALID because c exists in the object above and the type of the value set here is not a boolean
  d: {
    e:   123,  // valid because d.e exists in the object above and the type of the value set here is a boolean
    foo: 123   // valid because although d.foo doesn’t exist in myObject, its value is set to a number
  },
  e: 123    //  NOT VALID because e doesn’t exist in myObject and its value here is not set to a number
};

// NESTED LEVEL v4 END





type MutatorsNode<State> = {
  [K in keyof State]?: State[K] extends object
    ? MutatorsNode<State[K]> & { [method: string]: (treedux: Treedux) => MutatorInterface<State[K]> }
    : (treedux: Treedux) => MutatorInterface<State[K]>
}

interface DataStoreOptions<State extends object>
{
  initialState: State;
  mutators?: MutatorsNode<State>;
}

export class DataStore<StateInterface extends Record<string, unknown>>
{
  public readonly KEY: string;
  private readonly initialState: StateInterface;
  private treedux: Treedux;
  
  public constructor(key: string, options: DataStoreOptions<StateInterface>)
  {
    this.KEY = key;
    this.initialState = options.initialState;
  }
  
  public static create<StateInterface extends Record<string, unknown>>(
    key: string,
    options: DataStoreOptions<StateInterface>,
  ): DataStore<StateInterface>
  {
    return new DataStore<StateInterface>(key, options);
  }
  
  public get state()
  {
    return StateNode.create<StateInterface>({ keyPath: [this.KEY] }, this.treedux);
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
