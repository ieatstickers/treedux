
declare const UNIQUE_SYMBOL: unique symbol;
type Destructor = () => void | { [UNIQUE_SYMBOL]: never };
type EffectCallback = () => void | Destructor;
type DependencyList = ReadonlyArray<any>;

export type UseEffectHook = (effect: EffectCallback, deps?: DependencyList) => void;
