import { IsOptional, IsEnum, IsDateString, IsString, IsIn } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';
import { OrderStatus, OrderType } from '@prisma/client';

export class AdminOrderQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsEnum(OrderType)
  type?: OrderType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['createdAt', 'totalAmount', 'status', 'customerName'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}
