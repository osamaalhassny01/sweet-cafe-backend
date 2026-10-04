import { PaginationMeta } from '../../shared/pagination/pagination-meta.interface';

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function paginationSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}
