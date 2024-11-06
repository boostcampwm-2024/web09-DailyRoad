import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UserModule } from '../user/user.module';
import { CourseRepository } from './course.repository';

@Module({
  imports: [UserModule],
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
})
export class CourseModule {}
