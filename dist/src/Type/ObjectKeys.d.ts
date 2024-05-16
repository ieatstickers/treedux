import { IsPrimitive } from "./IsPrimitive";
export type ObjectKeys<T> = IsPrimitive<T> extends true ? void : keyof T extends infer K ? string extends K ? string : K : never;
