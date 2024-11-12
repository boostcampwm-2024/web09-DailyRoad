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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UserModule,
    PlaceModule,
    MapModule,
    CourseModule,
    BannerModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
