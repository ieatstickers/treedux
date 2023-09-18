import { Treedux } from "../Treedux";
import { MutatorInterface } from "../Data/MutatorInterface";

export type MutatorCreator<StateInterface> = (treedux: Treedux) => MutatorInterface<StateInterface>
