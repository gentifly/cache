import { Redis } from 'ioredis';

import { Environment } from '@gentifly/environment';

export class RedisDatabaseProvider {
  private provider!: Redis;

  public prepare = async (): Promise<void> => {
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
