export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: unknown[];
}

export interface ApiPaginatedData<T> {
  data: T[];
  meta: Record<string, unknown>;
}
