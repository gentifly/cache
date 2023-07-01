/// <reference path="./builder.d.ts" />
/// <reference path="./cache.d.ts" />
/// <reference path="./exceptions.d.ts" />

declare module '@gentifly/cache' {
  export class CacheProvider {
    public static prepare: () => Promise<void>;
  }
}
