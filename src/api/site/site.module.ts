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

@Module({
  imports: [ConfigModule,
    TypeOrmModule.forFeature([SiteEntity, SiteReviewEntity, SiteRequestEntity, SiteCategoryEntity]),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        node: config.get('ELASTICSEARCH_URL'),
      }),
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
          url: config.get('REDIS_URL'),
        });
        await client.connect();
        // console.log('redis connected!');
        return client;
      }
    },
    SiteRepository,
    SiteRequestRepository,
    SiteCategoryRepository
  ],
})
export class SiteModule {}
