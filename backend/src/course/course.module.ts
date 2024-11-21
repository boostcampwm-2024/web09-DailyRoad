import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UserModule } from '../user/user.module';
import { CourseRepository } from './course.repository';
import { PlaceModule } from '../place/place.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursePlace } from '@src/course/entity/course-place.entity';

@Module({
  imports: [UserModule, PlaceModule, TypeOrmModule.forFeature([CoursePlace])],
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
})
export class CourseModule {}
