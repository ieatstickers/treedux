
declare const UNDEFINED_VOID_ONLY: unique symbol;
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
type EffectCallback = () => void | Destructor;
type DependencyList = ReadonlyArray<any>;

export type UseEffectHook = (effect: EffectCallback, deps?: DependencyList) => void;
