import { Module, Global } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { createLogger } from './logger';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: () => ({
        pinoHttp: {
          logger: createLogger(),
          autoLogging: false, // HTTP 요청 로깅 비활성화
          customLogLevel: () => 'silent',
        },
      }),
    }),
  ],
  exports: [LoggerModule],
})
export class CustomLoggerModule {}
