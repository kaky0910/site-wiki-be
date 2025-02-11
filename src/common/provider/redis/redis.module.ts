import { Module } from "@nestjs/common";
import { redisClient } from "./redis.client";
import { RedisService } from "./redis.service";

@Module({
  providers: [
    redisClient,
    {
      provide: "IRedisService",
      useClass: RedisService
    }
  ],
  exports: [
    redisClient,
    {
      provide: "IRedisService",
      useClass: RedisService
    }
  ]
})
export class RedisModule {}