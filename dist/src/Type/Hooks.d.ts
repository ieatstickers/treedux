import { UseStateHook } from "./UseStateHook";
import { UseEffectHook } from "./UseEffectHook";
export type Hooks = {
    useState: UseStateHook;
    useEffect: UseEffectHook;
};
