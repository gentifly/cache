# Cache

Cache is a system to save data in memory to be more faster with data doesn't need a real-time value.

Loading Cache is a easy way to get real-time value with specific time in seconds from database and store it on memory,
this method can dispose a value stored in [Redis](https://redis.io) and if it's not present a callback will be called to get data from database.

## Usage

Here's a sample cache definition example:

```ts
export class UsersCache {
  private static cache = CacheBuilder.newBuilder()
    .keyable('users')
    .expireAfterWrite(3) // in seconds
    .build<string, User>(
      async (id: string) => {
        return ApplicationProvider.Repositories.POSTGRES.Users.findById({ id })
      }
    )
}
```

Getting data from cache will be more easily:

```ts
export class UsersCache {
  private static cache = CacheBuilder.newBuilder()
    .keyable('users')
    .expireAfterWrite(3) // in seconds
    .build<string, User>(
      async (id: string) => {
        return ApplicationProvider.Repositories.POSTGRES.Users.findById({ id })
      }
    )

  public static getUser = async (id: string): Promise<User | undefined | null> => {
    return await this.cache.get(id)
  }
}
```

Using cache manager in the controller is even easier:

```ts
export class UsersController {
  public static show = async (request, response) => {
    const id = request.params['id']

    const user = await UsersCache.getUser(id)

    if (!user) {
      throw new UserNotFoundException()
    }

    return response.status(200).json(user)
  }
}
```
