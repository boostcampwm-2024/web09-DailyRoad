import { Module, Global } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { createLogger } from './logger';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        pinoHttp: {
          logger: createLogger(
            configService.get('LOG_HOST'),
            configService.get('LOG_PORT'),
          ),
          autoLogging: false, // HTTP 요청 로깅 비활성화
          customLogLevel: () => 'silent',
        },
      }),
    }),
  ],
  exports: [LoggerModule],
})
export class CustomLoggerModule {}
