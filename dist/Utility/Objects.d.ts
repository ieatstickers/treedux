export declare class Objects {
    static isObject(value: any): value is object;
    static setByKeyPath<V, T>(keyPath: Array<string>, value: V, target: T): T;
    private static deepCopy;
}
