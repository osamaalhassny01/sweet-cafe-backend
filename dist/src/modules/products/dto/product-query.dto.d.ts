import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';
export declare class ProductQueryDto extends PaginationQueryDto {
    search?: string;
    categoryId?: string;
    isActive?: boolean;
    isAvailable?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy: 'createdAt' | 'price' | 'nameAr' | 'sortOrder';
    sortOrder: 'asc' | 'desc';
}
