
export type IsPOJO<T> = T extends Record<string, any>
  ? (T extends any[] | ((...args: any[]) => any) | Date | RegExp ? false : true)
  : false;
