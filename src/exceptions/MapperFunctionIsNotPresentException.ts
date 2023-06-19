import { Exception } from '@gentifly/zeraph/exceptions';

export class MapperFunctionIsNotPresentException extends Exception {
  constructor() {
    super('MapperFunctionIsNotPresentException', 'Mapper function is not present', 400);
  }
}
