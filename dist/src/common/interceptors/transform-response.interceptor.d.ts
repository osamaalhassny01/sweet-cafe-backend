import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../shared/response/api-response.interface';
export declare class TransformResponseInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T> | ApiSuccessResponse<unknown[]>> {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiSuccessResponse<T>>;
    private isPaginated;
}
