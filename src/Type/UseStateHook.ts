
export type UseStateHook = <Type>(initialState: Type) => [Type, (value: Type) => void];
