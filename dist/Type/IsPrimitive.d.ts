export type IsPrimitive<T> = T extends string | number | boolean | bigint | symbol | undefined | null ? true : false;
