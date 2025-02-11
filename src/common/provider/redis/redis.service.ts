import { Inject, Injectable } from "@nestjs/common";
import { RedisClientType, SetOptions } from "redis";

interface Events {
  basicEmit: (a: number, b: string, c: number[]) => void;
}
@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType
  ) {}

  setValue(key: string, value: string, ttl: number | null) {
    if (ttl) {
      return this.redisClient.set(key, value, {
        EX: ttl
      });
    }
    return this.redisClient.set(key, value);
  }

  getValue(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  getValues(keys: string[]): Promise<string[]> {
    return this.redisClient.mGet(keys);
  }

  deleteValue(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  deleteValues(keys: string[]): Promise<number> {
    return this.redisClient.del(keys);
  }

  getHashValue(key: string, field: string): Promise<string> {
    return this.redisClient.hGet(key, field);
  }

  setHashValue(key: string, field: string, value: string): Promise<number> {  
    return this.redisClient.hSet(key, field, value);
  }

  // redis set add
  setSetAdd(key: string, value: string): Promise<number> {
    return this.redisClient.sAdd(key, value);
  }

  // redis set add values
  setSetAddValues(key: string, values: string[]): Promise<number> {
    return this.redisClient.sAdd(key, values);
  }

  setSetRemove(key: string, value: string): Promise<number> {
    return this.redisClient.sRem(key, value);
  }

  // redis set remove values
  setSetRemoveValues(key: string, values: string[]): Promise<number> {
    return this.redisClient.sRem(key, values);
  }

  getSetLength(key: string): Promise<number> {
    return this.redisClient.sCard(key);
  }
  
}