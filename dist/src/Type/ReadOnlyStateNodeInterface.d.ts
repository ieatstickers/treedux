export interface ReadOnlyStateNodeInterface<Type> {
    get(): Type;
    subscribe(callback: (data: Type) => void): () => void;
}
