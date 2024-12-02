import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './AppController';
import { AppService } from './AppService';
import { TypeOrmConfigService } from './config/TypeOrmConfigService';
import { MapModule } from './map/MapModule';
import { PlaceModule } from './place/PlaceModule';
import { CourseModule } from './course/CourseModule';
import { AuthModule } from './auth/AuthModule';
import { UserModule } from './user/UserModule';
import { BannerModule } from './banner/BannerModule';
import { AdminModule } from './admin/AdminModule';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TimezoneInterceptor } from './config/TimezoneInterceptor';
import { StorageModule } from './storage/StorageModule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CustomLoggerModule } from './common/log/CustomLoggerModule';
import { SearchModule } from './search/SearchModule';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { BatchModule } from './batch/BatchModule';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CustomLoggerModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      async dataSourceFactory(options) {
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        return addTransactionalDataSource(dataSource);
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 500,
      },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    PlaceModule,
    MapModule,
    CourseModule,
    BannerModule,
    AdminModule,
    StorageModule,
    SearchModule,
    BatchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimezoneInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
