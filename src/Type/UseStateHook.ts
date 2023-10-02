
type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);

export type UseStateHook = <S>(initialState: S | (() => S)) => [S, Dispatch<SetStateAction<S>>];
