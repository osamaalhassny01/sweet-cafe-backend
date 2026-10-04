import { ApiPaginatedData } from './api-response.interface';
export declare function paginatedResponse<T>(data: T[], meta: Record<string, unknown>): ApiPaginatedData<T>;
