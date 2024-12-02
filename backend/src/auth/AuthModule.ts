import { Module, Global } from '@nestjs/common';
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';
import { UserModule } from '../user/UserModule';
import { JWTHelper } from './JWTHelper';
import { RefreshTokenRepository } from './RefreshTokenRepository';

@Global()
@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, JWTHelper, RefreshTokenRepository],
  exports: [JWTHelper],
})
export class AuthModule {}
