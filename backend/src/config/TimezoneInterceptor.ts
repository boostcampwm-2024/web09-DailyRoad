import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TimezoneInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object') {
          return this.convertDateToSeoulTime(data);
        }
        return data;
      }),
    );
  }

  private convertDateToSeoulTime(data: any): any {
    for (const key in data) {
      if (data[key] instanceof Date) {
        data[key] = data[key].toLocaleString('ko-KR', {
          timeZone: 'Asia/Seoul',
        });
      } else if (typeof data[key] === 'object') {
        data[key] = this.convertDateToSeoulTime(data[key]);
      }
    }
    return data;
  }
}
