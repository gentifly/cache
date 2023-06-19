declare module '@gentifly/cache/exceptions' {
  import { Exception } from '@gentifly/zeraph/exceptions';

  export class CacheKeyCannotBeNullException extends Exception {
    constructor()
  }

  export class MapperFunctionIsNotPresentException extends Exception {
    constructor()
  }
}
