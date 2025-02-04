
// Interface to define default methods available on every state node
export interface ReadOnlyStateNodeInterface<Type>
{
  get(): Type,
  
  subscribe(callback: (data: Type) => void): () => void,
}
