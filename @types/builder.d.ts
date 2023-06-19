declare module '@gentifly/cache/builder' {
  import { LoadingCache } from '@gentifly/cache/cache/LoadingCache';

  export class CacheBuilder {
    /**
     * Create a new instance of CacheBuilder.
     * 
     * @returns CacheBuilder
     */
    public static newBuilder: () => CacheBuilder;

    /**
     * The key to be used in the cache.
     * 
     * @param keyable
     * @returns CacheBuilder
     */
    public keyable: (keyable: string) => this;

    /**
     * This cache stores data in the local memory.
     * 
     * @warning It is not recommended to use this cache in a production environment.
     * @returns CacheBuilder
     */
    public local: () => this;

    /**
     * Duration to expire the cache after write in seconds.
     * 
     * @param duration 
     * @returns CacheBuilder
     */
    public expireAfterWrite: (duration: number) => this;

    /**
     * Duration to expire the cache after access/read in seconds.
     * 
     * @param duration 
     * @returns CacheBuilder
     */
    public expireAfterAccess: (duration: number) => this;

    /**
     * Duration to refresh the cache after write in seconds.
     * 
     * @param duration 
     * @returns CacheBuilder
     */
    public refreshAfterWrite: (duration: number) => this;

    /**
     * Build and return the cache instance to be used.
     * 
     * @param mapper
     * @returns LoadingCache<K, V>
     * @throws CacheKeyCannotBeNullException
     */
    public build: <K, V> (mapper?: (key: K) => Promise<V>) => LoadingCache<K, V>;
  }
}
