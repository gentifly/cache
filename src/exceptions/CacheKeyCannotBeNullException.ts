import { Exception } from '@gentifly/exceptions';

export class CacheKeyCannotBeNullException extends Exception {
  constructor() {
    super('CacheKeyCannotBeNull', 'Cache key cannot be null', 400);
  }
}
