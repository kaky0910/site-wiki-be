import { Module } from '@nestjs/common';
import { SiteModule } from './site/site.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    SiteModule,
    ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
