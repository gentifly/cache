declare module '@gentifly/cache/exceptions' {
  import { Exception } from '@gentifly/exceptions';

  export class CacheKeyCannotBeNullException extends Exception {
    constructor()
  }

  export class MapperFunctionIsNotPresentException extends Exception {
    constructor()
  }
}
