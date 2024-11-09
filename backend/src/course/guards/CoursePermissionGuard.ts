import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CourseService } from '../course.service';
import { CoursePermissionException } from '../exception/CoursePermissionException';

@Injectable()
export class CoursePermissionGuard implements CanActivate {
  constructor(private readonly courseService: CourseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const courseId = Number(request.params.id);
    const userId = Number(request.user.userId);

    const course = await this.courseService.getCourseById(courseId);
    if (course.user.id !== userId) {
      throw new CoursePermissionException(courseId);
    }
    return course.user.id === userId;
  }
}
