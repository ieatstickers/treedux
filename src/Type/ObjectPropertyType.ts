import { IsPrimitive } from "./IsPrimitive";

export type ObjectPropertyType<T, K> = IsPrimitive<T> extends true
  ? void
  : K extends keyof T
    ? T[K]
    : K extends string
      ? string extends keyof T
        ? T[string]
        : never
      : K extends number
        ? number extends keyof T
          ? T[number]
          : never
        : never;
