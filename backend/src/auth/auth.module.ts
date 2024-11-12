import { Module, Global } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JWTHelper } from './JWTHelper';
import { RefreshTokenRepository } from './refresh-token.repository';

@Global()
@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, JWTHelper, RefreshTokenRepository],
  exports: [JWTHelper],
})
export class AuthModule {}
