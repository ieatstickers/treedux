import { NodeCacheInterface } from "./node-cache-interface";

export class LazyNodeCache implements NodeCacheInterface
{
  private readonly cache = new Map<string, object>();

  public get<T extends object>(keyPath: Array<string>): T | null
  {
    return (this.cache.get(this.toKey(keyPath)) ?? null) as T | null;
  }

  public set<T extends object>(keyPath: Array<string>, value: T): void
  {
    const key = this.toKey(keyPath);
    this.cache.set(key, value);
  }

  private toKey(keyPath: Array<string>): string
  {
    return keyPath.join("\x00");
  }
}
