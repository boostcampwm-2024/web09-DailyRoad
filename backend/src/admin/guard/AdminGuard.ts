import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/JwtAuthGuard';
import { AuthorizationException } from '@src/auth/exception/AuthorizationException';
import { UserRole } from '@src/user/user.role';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);

    if (!isAuthenticated) {
      return false;
    }
    if (!this.isAdmin(context)) {
      throw new AuthorizationException('관리자 권한이 없습니다.');
    }

    return true;
  }

  isAdmin(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user?.role === UserRole.ADMIN;
  }
}
