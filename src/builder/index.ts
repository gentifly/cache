import { LoadingCache } from '@gentifly/cache/cache/LoadingCache';

import { CacheKeyCannotBeNullException } from '@gentifly/cache/exceptions';

export class CacheBuilder {
  private _keyable: string | undefined;

  private _local = false;

  private _expireAfterWrite: number | undefined;
  private _expireAfterAccess: number | undefined;
  private _refreshAfterWrite: number | undefined;

  public static newBuilder = (): CacheBuilder => {
    return new CacheBuilder();
  };

  public keyable = (keyable: string) => {
    this._keyable = keyable;

    return this;
  };

  public local = () => {
    this._local = true;

    return this;
  };

  public expireAfterWrite = (duration: number) => {
    this._expireAfterWrite = duration;

    return this;
  };

  public expireAfterAccess = (duration: number) => {
    this._expireAfterAccess = duration;

    return this;
  };

  public refreshAfterWrite = (duration: number) => {
    this._refreshAfterWrite = duration;

    return this;
  };

  public build = <K, V> (mapper?: (key: K) => Promise<V>) => {
    if (!this._keyable) {
      throw new CacheKeyCannotBeNullException();
    }

    return new LoadingCache<K, V>(
      this._keyable,
      this._local,
      this._expireAfterWrite,
      this._expireAfterAccess,
      this._refreshAfterWrite,
      mapper
    );
  };
}
