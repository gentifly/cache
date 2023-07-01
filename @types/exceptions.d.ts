declare module '@gentifly/cache' {
  import { Exception } from '@gentifly/exceptions';

  export class CacheKeyCannotBeNullException extends Exception {
    constructor()
  }

  export class MapperFunctionIsNotPresentException extends Exception {
    constructor()
  }
}
