import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JWTHelper {
  private readonly jwtSecretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY');
  }

  generateToken(expiresIn: string | number, payload: any = {}): string {
    return jwt.sign(payload, this.jwtSecretKey, {
      expiresIn,
    });
  }

  verifyToken(refreshToken: string) {
    return jwt.verify(refreshToken, this.jwtSecretKey);
  }
}
