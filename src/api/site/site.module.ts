import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { SiteService } from './service/site.service';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';
import { createClient } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndexService } from './service/index.service';
import { SiteRepository } from './repository/site.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteEntity } from './entities/site.entity';
import { SiteReviewEntity } from './entities/site-review.entity';
import { SiteRequestEntity } from './entities/site-request.entity';
import { SchedulerService } from './service/scheduler.service';
import { SiteRequestRepository } from './repository/site-request.repository';
import { VerifyUrlService } from './service/verify-url.service';
import { RequestService } from './service/request.service';
import { RequestController } from './request.controller';
import { SiteCategoryEntity } from './entities/category.entity';
import { SiteCategoryRepository } from './repository/category.repository';
import { RedisService } from 'src/common/provider/redis/redis.service';

@Module({
  imports: [ConfigModule,
    TypeOrmModule.forFeature([SiteEntity, SiteReviewEntity, SiteRequestEntity, SiteCategoryEntity]),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule], // ✅ ConfigModule을 명시적으로 추가
      useFactory: async (config: ConfigService) => {
        return {
          node: config.get<string>('ELASTICSEARCH_NODE'),
          auth: {
            username: config.get<string>('ELASTICSEARCH_USERNAME'),
            password: config.get<string>('ELASTICSEARCH_PASSWORD'),
          },
        };
      },
      inject: [ConfigService],
    })],
  controllers: [SiteController, RequestController],
  providers: [
    SiteService,
    IndexService,
    SchedulerService,
    VerifyUrlService,
    RequestService,
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const client = createClient({
          url: config.get<string>('REDIS_URL'),
          password: config.get<string>('REDIS_PASSWORD'),
        });
        await client.connect();
        // console.log('redis connected!');
        return client;
      }
    },
    SiteRepository,
    SiteRequestRepository,
    SiteCategoryRepository,
    RedisService
  ],
})
export class SiteModule {}
