import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';

@Injectable()
export class SampleTraceInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const shouldTrace = Math.random() < 0.2; // 20% 샘플링

    if (!shouldTrace) {
      return next.handle();
    }

    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const traceId = randomUUID();
    const startTime = Date.now();

    // 비동기 로깅: 메서드 진입 시점 로그
    setTimeout(() => {
      this.logger.trace(
        `[Trace - Entering] ${className}.${handlerName} - traceId: ${traceId}`,
      );
    }, 0);

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();

        // 비동기 로깅: 메서드 종료 시점 로그
        setTimeout(() => {
          this.logger.trace(
            `[Trace - Exiting] ${className}.${handlerName} - traceId: ${traceId} - ${endTime - startTime}ms`,
          );
        }, 0);
      }),
    );
  }
}
