declare module '@gentifly/cache/cache/LoadingCache' {
  export class LoadingCache<K, V> {
    constructor(
      keyable: string,
      expireAfterWrite: number | undefined,
      expireAfterAccess: number | undefined,
      refreshAfterWrite: number | undefined,
      mapper?: (key: K) => Promise<V>
    )

    /**
     * Get the value from the cache if it is present, otherwise return null.
     * 
     * @param key 
     * @returns 
     */
    getIfPresent: (key: K) => Promise<V | undefined | null>;

    /**
     * Get the value from the cache or from the mapper if the value is not present in the cache.
     * If the value is not present in the cache and the mapper is not provided, it will return null and put the value in the cache.
     * 
     * @param key
     * @returns V | undefined | null
     */
    get: (key: K) => Promise<V | undefined | null>;

    /**
     * Put the value in the cache.
     * 
     * @param key 
     * @param value 
     * @returns Promise<void>
     * @throws MapperFunctionIsNotPresentException
     */
    put: (key: K, value: V) => Promise<void>;

    /**
     * Invalidate the value from the cache if it is present and return the number of keys that were removed.
     * 
     * @param key
     * @returns Promise<number>
     */
    invalidate: (key: K) => Promise<number>;

    /**
     * Invalidate all the values from the cache and return the number of keys that were removed.
     * 
     * @returns Promise<number>
     */
    invalidateAll: () => Promise<number>;

    /**
     * Return the number of keys that are present in the cache.
     * 
     * @returns Promise<number>
     */
    size: () => Promise<number>;

    /**
     * Fetch all the values from the cache and convert them to an array.
     * 
     * @returns Promise<Map<K, V>>
     */
    asMap: () => Promise<Map<K, V>>;
  }
}
