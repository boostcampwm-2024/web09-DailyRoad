import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { AppController } from '@src/AppController';
import { AppService } from '@src/AppService';
import { TypeOrmConfigService } from '@src/config/TypeOrmConfigService';
import { TimezoneInterceptor } from '@src/config/TimezoneInterceptor';
import { MapModule } from '@src/map/MapModule';
import { PlaceModule } from '@src/place/PlaceModule';
import { CourseModule } from '@src/course/CourseModule';
import { AuthModule } from '@src/auth/AuthModule';
import { UserModule } from '@src/user/UserModule';
import { BannerModule } from '@src/banner/BannerModule';
import { AdminModule } from '@src/admin/AdminModule';
import { StorageModule } from '@src/storage/StorageModule';
import { SearchModule } from '@src/search/SearchModule';
import { BatchModule } from '@src/batch/BatchModule';
import { CustomLoggerModule } from '@src/common/log/CustomLoggerModule';

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
