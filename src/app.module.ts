import { Module } from '@nestjs/common';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';
import { ApiModule } from './api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';

@Module({
  imports: [ElasticsearchModule.register({
    node: 'http://1.236.152.96:9200',
  }),
  ApiModule,
  TypeOrmModule.forRoot(typeORMConfig),
],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
