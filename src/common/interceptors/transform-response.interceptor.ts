import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiPaginatedData, ApiSuccessResponse } from '../../shared/response/api-response.interface';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T> | ApiSuccessResponse<unknown[]>>
{
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiSuccessResponse<T>> {
    return next.handle().pipe(
      map((payload: T | ApiPaginatedData<unknown>) => {
        if (this.isPaginated(payload)) {
          return {
            success: true,
            data: payload.data,
            meta: payload.meta,
          } as ApiSuccessResponse<T>;
        }

        return {
          success: true,
          data: payload,
        } as ApiSuccessResponse<T>;
      }),
    );
  }

  private isPaginated(payload: unknown): payload is ApiPaginatedData<unknown> {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      Array.isArray((payload as ApiPaginatedData<unknown>).data) &&
      typeof (payload as ApiPaginatedData<unknown>).meta === 'object'
    );
  }
}
