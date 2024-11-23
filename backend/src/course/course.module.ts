import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UserModule } from '../user/user.module';
import { CourseRepository } from './course.repository';
import { PlaceModule } from '../place/place.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursePlace } from '@src/course/entity/course-place.entity';
import { AdminGuard } from '@src/admin/guard/AdminGuard';
import { CoursePermissionGuard } from '@src/course/guards/CoursePermissionGuard';
import { AdminModule } from '@src/admin/admin.module';

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
