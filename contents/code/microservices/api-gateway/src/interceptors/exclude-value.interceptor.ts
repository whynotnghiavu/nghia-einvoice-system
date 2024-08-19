import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeValueInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return this.excludeValuesInArray(data);
        } else if (data) {
          return this.excludeValue(data);
        }
        return data;
      }),
    );
  }

  private excludeValuesInArray(arrayData: any[]): any[] {
    return arrayData.map((item) => this.excludeValue(item));
  }

  private excludeValue(data: any): any {
    if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach((key) => {
        if (data[key]?.hasOwnProperty('value')) {
          data[key] = data[key].value;
        }
      });
    }
    return data;
  }
}
