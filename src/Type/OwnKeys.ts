
type DefaultKeys = keyof Object
  | keyof Array<any>
  | keyof Date
  | keyof RegExp
  | keyof string
  | keyof number
  | keyof boolean
  | keyof null
  | keyof undefined
  | keyof void
  | keyof symbol
  | keyof bigint;

export type OwnKeys<T> = Exclude<keyof T, DefaultKeys>;
