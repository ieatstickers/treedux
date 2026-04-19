import { NodeCacheInterface } from "./node-cache-interface";

export class GcNodeCache implements NodeCacheInterface
{
  private readonly cache = new Map<string, WeakRef<object>>();
  private readonly registry = new FinalizationRegistry<string>((key) => {
    this.cache.delete(key);
  });

  public static isSupported(): boolean
  {
    return typeof WeakRef !== "undefined" && typeof FinalizationRegistry !== "undefined";
  }

  public get<T extends object>(keyPath: Array<string>): T | null
  {
    return (this.cache.get(this.toKey(keyPath))?.deref() ?? null) as T | null;
  }

  public set<T extends object>(keyPath: Array<string>, value: T): void
  {
    const key = this.toKey(keyPath);
    this.cache.set(key, new WeakRef(value));
    this.registry.register(value, key);
  }

  private toKey(keyPath: Array<string>): string
  {
    return keyPath.join("\x00");
  }
}
