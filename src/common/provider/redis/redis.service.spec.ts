import { Test, TestingModule } from "@nestjs/testing";
import { todo } from "node:test";
import { IRedisService } from "./interface/redis.service.interface";
import { redisClient } from "./redis.client";
import { RedisClientType } from "redis";
import { RedisService } from "./redis.service";

describe('RedisService', () => {
  let redisService: IRedisService;
  let client: RedisClientType;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        redisClient,
        RedisService
      ],
      
    }).compile();

    client = module.get<RedisClientType>('REDIS_CLIENT') as jest.Mocked<RedisClientType>;
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(async () => {
    client.disconnect();
  })

  describe('REDIS client', () => {
    it('client connected', async () => {
      var result = await client.ping();
      expect(result).toEqual('PONG');
    });

    it('set/get value', async () => {
      var key = 'key';
      var value = 'value123';

      await redisService.setValue(key, value, null);

      var result = await redisService.getValue(key);

      expect(result).toEqual(value);

    });

  });

});