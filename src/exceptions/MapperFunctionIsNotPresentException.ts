import { Exception } from '@gentifly/exceptions';

export class MapperFunctionIsNotPresentException extends Exception {
  constructor() {
    super('MapperFunctionIsNotPresentException', 'Mapper function is not present', 400);
  }
}
