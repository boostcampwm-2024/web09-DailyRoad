import { Module } from '@nestjs/common';
import { CourseService } from './CourseService';
import { CourseController } from './CourseController';
import { UserModule } from '../user/UserModule';
import { CourseRepository } from './CourseRepository';
import { PlaceModule } from '../place/PlaceModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursePlace } from '@src/course/entity/CoursePlace';
import { AdminGuard } from '@src/admin/guard/AdminGuard';
import { CoursePermissionGuard } from '@src/course/guards/CoursePermissionGuard';
import { AdminModule } from '@src/admin/AdminModule';

@Module({
  imports: [
    UserModule,
    PlaceModule,
    AdminModule,
    TypeOrmModule.forFeature([CoursePlace]),
  ],
  controllers: [CourseController],
  providers: [
    CourseService,
    CourseRepository,
    CoursePermissionGuard,
    AdminGuard,
  ],
  exports: [CoursePermissionGuard],
})
export class CourseModule {}
