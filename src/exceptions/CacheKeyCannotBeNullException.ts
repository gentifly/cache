import { Exception } from '@gentifly/zeraph/exceptions';

export class CacheKeyCannotBeNullException extends Exception {
  constructor() {
    super('CacheKeyCannotBeNull', 'Cache key cannot be null', 400);
  }
}
