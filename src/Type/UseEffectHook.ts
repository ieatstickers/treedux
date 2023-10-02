
type Destructor = () => void;
type EffectCallback = () => void | Destructor;
type DependencyList = ReadonlyArray<any>;

export type UseEffectHook = (effect: EffectCallback, deps?: DependencyList) => void;
