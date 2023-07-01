import { CacheProvider } from '@gentifly/cache/CacheProvider';

import { MapperFunctionIsNotPresentException } from '@gentifly/cache/exceptions';

export class LoadingCache<K, V> {
  private keyable: string;

  private local: boolean;

  private expireAfterWrite: number | undefined;
  private expireAfterAccess: number | undefined;
  private refreshAfterWrite: number | undefined;

  private mapper?: (key: K) => Promise<V | undefined | null>;

  private storage = new Map<K, V>();

  constructor(
    keyable: string,
    local: boolean,
    expireAfterWrite: number | undefined,
    expireAfterAccess: number | undefined,
    refreshAfterWrite: number | undefined,
    mapper?: (key: K) => Promise<V | undefined | null>
  ) {
    this.keyable = keyable;
    this.local = local;
    this.expireAfterWrite = expireAfterWrite;
    this.expireAfterAccess = expireAfterAccess;
    this.refreshAfterWrite = refreshAfterWrite;

    this.mapper = mapper;
  }

  /**
   * Get the value from the cache if it is present, otherwise return null.
   * 
   * @param key 
   * @returns 
   */
  public getIfPresent = async (key: K): Promise<V | undefined | null> => {
    if (this.isLocal) {
      const value = this.storage.get(key);

      if (this.expireAfterAccess && value) {
        setTimeout(() => {
          this.storage.delete(key);
        }, this.expireAfterAccess * 1000);
      }

      return value;
    }

    const serialized = await CacheProvider.Databases.Redis.provide().get(`${this.keyable}:${key}`);

    if (this.expireAfterAccess) {
      await CacheProvider.Databases.Redis.provide().expire(`${this.keyable}:${key}`, this.expireAfterAccess);
    }

    return serialized ? JSON.parse(serialized) : null;
  };

  /**
   * Get the value from the cache or from the mapper if the value is not present in the cache.
   * If the value is not present in the cache and the mapper is not provided, it will return null and put the value in the cache.
   * 
   * @param key
   * @returns V | undefined | null
   */
  public get = async (key: K): Promise<V | undefined | null> => {
    if (this.isLocal) {
      const value = this.storage.get(key);

      if (!value && this.mapper) {
        const value = await this.mapper(key);

        if (value) {
          this.storage.set(key, value);
        }

        if (this.expireAfterWrite) {
          setTimeout(() => {
            this.storage.delete(key);
          }, this.expireAfterWrite * 1000);
        }
      }

      if (this.expireAfterAccess && value) {
        setTimeout(() => {
          this.storage.delete(key);
        }, this.expireAfterAccess * 1000);
      }

      return value;
    }

    const serialized = await CacheProvider.Databases.Redis.provide().get(`${this.keyable}:${key}`);

    if (!serialized && this.mapper) {
      const value = await this.mapper(key);

      if (value) {
        await this.put(key, value);
      }

      return value;
    }

    if (this.expireAfterAccess) {
      await CacheProvider.Databases.Redis.provide().expire(`${this.keyable}:${key}`, this.expireAfterAccess);
    }

    return serialized ? JSON.parse(serialized) : null;
  };

  /**
   * Put the value in the cache.
   * 
   * @param key 
   * @param value 
   * @returns Promise<void>
   * @throws MapperFunctionIsNotPresentException
   */
  public put = async (key: K, value: V): Promise<void> => {
    if (this.isLocal) {
      this.storage.set(key, value);

      if (this.expireAfterWrite) {
        setTimeout(() => {
          this.storage.delete(key);
        }, this.expireAfterWrite * 1000);
      }

      if (this.refreshAfterWrite) {
        setTimeout(async () => {
          if (!this.mapper) {
            throw new MapperFunctionIsNotPresentException();
          }

          const value = await this.mapper(key);

          if (!value) {
            return;
          }

          this.put(key, value);
        }, this.refreshAfterWrite * 1000);
      }

      return;
    }

    await CacheProvider.Databases.Redis.provide().set(`${this.keyable}:${key}`, JSON.stringify(value));

    if (this.expireAfterWrite) {
      await CacheProvider.Databases.Redis.provide().expire(`${this.keyable}:${key}`, this.expireAfterWrite);
    }

    if (this.refreshAfterWrite) {
      setTimeout(async () => {
        if (!this.mapper) {
          throw new MapperFunctionIsNotPresentException();
        }

        const value = await this.mapper(key);

        if (!value) {
          return;
        }

        this.put(key, value);
      }, this.refreshAfterWrite * 1000);
    }
  };

  /**
   * Invalidate the value from the cache if it is present and return the number of keys that were removed.
   * 
   * @param key
   * @returns Promise<number>
   */
  public invalidate = async (key: K): Promise<number> => {
    if (this.isLocal) {
      return this.storage.delete(key) ? 1 : 0;
    }

    return await CacheProvider.Databases.Redis.provide().del(`${this.keyable}:${key}`);
  };

  /**
   * Invalidate all the values from the cache and return the number of keys that were removed.
   * 
   * @returns Promise<number>
   */
  public invalidateAll = async (): Promise<number> => {
    if (this.isLocal) {
      const size = this.storage.size;

      this.storage.clear();

      return size;
    }

    return await CacheProvider.Databases.Redis.provide().del(`${this.keyable}:*`);
  };

  /**
   * Return the number of keys that are present in the cache.
   * 
   * @returns Promise<number>
   */
  public size = async (): Promise<number> => {
    if (this.isLocal) {
      return this.storage.size;
    }

    return await CacheProvider.Databases.Redis.provide().llen(`${this.keyable}:*`);
  };

  /**
   * Fetch all the values from the cache and convert them to an array.
   * 
   * @returns Promise<Map<K, V>>
   */
  public asMap = async (): Promise<Map<K, V>> => {
    if (this.isLocal) {
      return this.storage;
    }

    const map = new Map<K,V>();

    const values = await CacheProvider.Databases.Redis.provide().keys(`${this.keyable}:*`);

    for (const value of values) {
      const key = value.replace(`${this.keyable}:`, '');

      const serialized = await CacheProvider.Databases.Redis.provide().get(value);

      if (serialized) {
        map.set(key as unknown as K, JSON.parse(serialized));
      }
    }

    return map;
  };

  private get isLocal(): boolean {
    return this.local;
  }
}
