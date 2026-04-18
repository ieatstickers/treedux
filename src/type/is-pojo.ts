// Utility type to determine if a type is a plain old javascript object
export type IsPOJO<T> = T extends Record<string, any>
  ? (T extends any[] | ((...args: any[]) => any) | Date | RegExp ? false : true)
  : false;
