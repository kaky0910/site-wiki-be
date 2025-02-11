import { createClient } from 'redis';

export const redisClient = 
{
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client = createClient({
      url: 'redis://1.236.152.96:6379'
    });
    await client.connect();
    // console.log('redis connected!');
    return client;
  }
}

