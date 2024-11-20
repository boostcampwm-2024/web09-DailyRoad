import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '@src/user/user.service';
import { UserPermissionException } from '@src/user/exception/UserPermissionException';

@Injectable()
export class UserPermissionGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = Number(request.params.id);
    const requesterId = Number(request.user.userId);

    const user = await this.userService.getUserInfo(userId);
    if (user.id !== requesterId) {
      throw new UserPermissionException(userId);
    }
    return true;
  }
}
