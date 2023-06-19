import { LoadingCache } from '@gentifly/cache/cache/LoadingCache';

import { CacheKeyCannotBeNullException } from '@gentifly/cache/exceptions';

export class CacheBuilder {
  private _keyable: string | undefined;
  private _expireAfterWrite: number | undefined;
  private _expireAfterAccess: number | undefined;
  private _refreshAfterWrite: number | undefined;

  public static newBuilder = (): CacheBuilder => {
    return new CacheBuilder();
  };

  /**
   * The key to be used in the cache.
   * 
   * @param keyable
   * @returns CacheBuilder
   */
  public keyable = (keyable: string) => {
    this._keyable = keyable;

    return this;
  };

  /**
   * Duration to expire the cache after write in seconds.
   * 
   * @param duration 
   * @returns CacheBuilder
   */
  public expireAfterWrite = (duration: number) => {
    this._expireAfterWrite = duration;

    return this;
  };

  /**
   * Duration to expire the cache after access/read in seconds.
   * 
   * @param duration 
   * @returns CacheBuilder
   */
  public expireAfterAccess = (duration: number) => {
    this._expireAfterAccess = duration;

    return this;
  };

  /**
   * Duration to refresh the cache after write in seconds.
   * 
   * @param duration 
   * @returns CacheBuilder
   */
  public refreshAfterWrite = (duration: number) => {
    this._refreshAfterWrite = duration;

    return this;
  };

  /**
   * Build and return the cache instance to be used.
   * 
   * @param mapper
   * @returns LoadingCache<K, V>
   * @throws CacheKeyCannotBeNullException
   */
  public build = <K, V> (mapper?: (key: K) => Promise<V>) => {
    if (!this._keyable) {
      throw new CacheKeyCannotBeNullException();
    }

    return new LoadingCache<K, V>(
      this._keyable,
      this._expireAfterWrite,
      this._expireAfterAccess,
      this._refreshAfterWrite,
      mapper
    );
  };
}
