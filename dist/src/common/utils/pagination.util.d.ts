import { PaginationMeta } from '../../shared/pagination/pagination-meta.interface';
export declare function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta;
export declare function paginationSkip(page: number, limit: number): number;
