import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CourseService } from '../course.service';
import { CoursePermissionException } from '../exception/CoursePermissionException';
import { AdminGuard } from '@src/admin/guard/AdminGuard';

@Injectable()
export class CoursePermissionGuard implements CanActivate {
  constructor(
    private readonly adminGuard: AdminGuard,
    private readonly courseService: CourseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAdmin = this.adminGuard.isAdmin(context);
    if (isAdmin) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const courseId = Number(request.params.id);
    const userId = Number(request.user.userId);
    const courseOwnerId = await this.courseService.getCourseOwnerId(courseId);
    if (courseOwnerId !== userId) {
      throw new CoursePermissionException(courseId);
    }
    return true;
  }
}
