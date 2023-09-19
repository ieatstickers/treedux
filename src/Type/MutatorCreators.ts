
// Type-hints for the properties present in the Type parameter
// and forces any custom keys to be functions that return any (soon to be MutatorInterface<Type> when switched out for MutatorCreator)
export type MutatorCreators<Type> = {
  [K in keyof Type]?: Type[K] extends Record<string, any>
    ? MutatorCreators<Type[K]>
    : { [key: string]: (...args: Array<any>) => any } // TODO: Switch function signature for MutatorCreator
} | { [key: string]: (...args: Array<any>) => any } // TODO: Figure out if this is required (and if it is, switch function signature for MutatorCreator)
