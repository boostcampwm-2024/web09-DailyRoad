import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private jwtSecretKey: string;
  private authService: AuthService;

  constructor(private configService: ConfigService) {
    this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }
    try {
      request.user = jwt.verify(token, this.jwtSecretKey) as {
        name: string;
        picture: string;
        provider: 'google';
      };
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('만료된 토큰입니다.');
      }
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
