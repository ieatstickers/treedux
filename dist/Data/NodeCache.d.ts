export declare class NodeCache {
    private readonly cache;
    private readonly registry;
    get<T extends object>(keyPath: Array<string>): T | null;
    set<T extends object>(keyPath: Array<string>, value: T): void;
    private toKey;
}
