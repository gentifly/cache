import { Redis } from 'ioredis';

import { IProvider } from '@gentifly/zeraph/providers';

import { Environment } from '@gentifly/zeraph/environment';

export class RedisDatabaseProvider implements IProvider<Redis> {
  private provider!: Redis;

  public prepare = async (): Promise<void> => {
    console.log('called');

    this.provider = new Redis({
      host: Environment.getString('REDIS_HOST'),
      port: Environment.getInt('REDIS_PORT'),
      username: Environment.getString('REDIS_USERNAME'),
      password: Environment.getString('REDIS_PASSWORD'),
      db: Environment.getInt('REDIS_DATABASE')
    });
  };

  public provide = () => this.provider;
}
