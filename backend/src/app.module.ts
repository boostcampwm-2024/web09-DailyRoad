import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './config/TypeOrmConfigService';
import { MapModule } from './map/map.module';
import { PlaceModule } from './place/place.module';
import { CourseModule } from './course/course.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BannerModule } from './banner/banner.module';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TimezoneInterceptor } from './config/TimezoneInterceptor';
import { StorageModule } from './storage/storage.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CustomLoggerModule } from './common/log/CustomLoggerModule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CustomLoggerModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 500,
      },
    ]),
    AuthModule,
    UserModule,
    PlaceModule,
    MapModule,
    CourseModule,
    BannerModule,
    AdminModule,
    StorageModule,
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
