declare module '@gentifly/cache' {
  export class CacheProvider {
    public static prepare: () => Promise<void>;
  }
}
