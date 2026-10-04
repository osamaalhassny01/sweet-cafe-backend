import { ApiPaginatedData } from './api-response.interface';

export function paginatedResponse<T>(
  data: T[],
  meta: Record<string, unknown>,
): ApiPaginatedData<T> {
  return { data, meta };
}
