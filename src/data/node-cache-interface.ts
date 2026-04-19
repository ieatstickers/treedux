export interface NodeCacheInterface
{
  get<T extends object>(keyPath: Array<string>): T | null;

  set<T extends object>(keyPath: Array<string>, value: T): void;
}
