import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  nameAr: string;

  @IsString()
  nameEn: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
