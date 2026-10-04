import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';
import { OrderStatus, OrderType } from '@prisma/client';
export declare class AdminOrderQueryDto extends PaginationQueryDto {
    status?: OrderStatus;
    type?: OrderType;
    startDate?: string;
    endDate?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}
