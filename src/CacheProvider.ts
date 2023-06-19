import { RedisDatabaseProvider } from '@gentifly/cache/databases';

export class CacheProvider {
  public static prepare = async () => {
    await CacheProvider.Databases.Redis.prepare();
  };

  public static Databases = {
    Redis: new RedisDatabaseProvider()
  };
}
