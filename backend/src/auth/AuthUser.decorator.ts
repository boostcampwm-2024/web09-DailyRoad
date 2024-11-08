import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticationException } from './exception/AuthenticationException';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const requestingUser = ctx.switchToHttp().getRequest().user;
    if (!requestingUser) {
      throw new AuthenticationException('인증 정보가 없습니다.');
    }

    if (!isAuthUser(requestingUser)) {
      throw new AuthenticationException('유효하지 않은 인증 정보입니다.');
    }

    return requestingUser as AuthUser;
  },
);

export interface AuthUser {
  userId: string;
  role: string;
}

function isAuthUser(obj: any): obj is AuthUser {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.userId === 'number' &&
    typeof obj.role === 'string'
  );
}