import { Injectable } from '@nestjs/common';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable()
export class AiCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly ttl =
    parseInt(process.env.AI_CACHE_TTL_SEC ?? '300', 10) * 1000;

  set<T>(key: string, value: T, ttl?: number) {
    const expiresAt = Date.now() + (ttl ?? this.ttl);
    this.cache.set(key, { value, expiresAt });
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  buildCacheKey(
    id: string,
    params: Record<string, any>,
    updatedAt: string | number,
  ): string {
    const paramsString = JSON.stringify(
      Object.keys(params)
        .sort()
        .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {}),
    );
    return `${id}:${paramsString}:${updatedAt}`;
  }
}
