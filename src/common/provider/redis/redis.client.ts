import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const redisClient = 
{
  provide: 'REDIS_CLIENT',
  useFactory: async (configService: ConfigService) => {
    const client = createClient({
      url: 'redis://1.236.152.96:6379',
      password: configService.get<string>('REDIS_PASSWORD'),
    });
    await client.connect();
    // console.log('redis connected!');
    return client;
  }
}

