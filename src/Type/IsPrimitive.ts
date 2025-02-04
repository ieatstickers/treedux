// Helper type to check if T is a primitive type
export type IsPrimitive<T> = T extends string | number | boolean | bigint | symbol | undefined | null ? true : false;
