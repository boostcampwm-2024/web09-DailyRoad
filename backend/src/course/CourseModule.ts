import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from '@src/course/CourseService';
import { CourseController } from '@src/course/CourseController';
import { CourseRepository } from '@src/course/CourseRepository';
import { CoursePlace } from '@src/course/entity/CoursePlace';
import { CoursePermissionGuard } from '@src/course/guards/CoursePermissionGuard';
import { PlaceModule } from '@src/place/PlaceModule';
import { UserModule } from '@src/user/UserModule';
import { AdminGuard } from '@src/admin/guard/AdminGuard';
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
