import { Treedux } from "../Treedux";
import { MutatorInterface } from "../Data/MutatorInterface";

// A mutator creator is a function that returns an instance of a MutatorInterface
// Treedux doesn't hold the entire state tree in memory. Instead, it type-hints for the whole tree and only creates
// each node as it is needed. Mutators are no different - they are only created when the node they're associated with
// is requested. The MutatorCreator is the function that Treedux calls when it needs the mutators associated with
// a particular state tree node.
export type MutatorCreator<StateInterface> = (treedux: Treedux) => MutatorInterface<StateInterface>
