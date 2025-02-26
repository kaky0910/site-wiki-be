import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}),
    ApiModule,
    TypeOrmModule.forRoot(typeORMConfig),
],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
