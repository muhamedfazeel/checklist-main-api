import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

interface ResponseStructure<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

@Injectable()
export class SuccessResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const responseStructure: ResponseStructure<T> = {
          success: true,
          code: data?.code || HttpStatus.OK,
          message: data?.Message || 'SUCCESS',
          data: data || null,
        };
        context.switchToHttp().getResponse().status(responseStructure.code);
        return responseStructure;
      }),
    );
  }
}
