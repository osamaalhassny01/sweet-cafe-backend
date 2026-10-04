import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateOfferDto {
  @IsString()
  titleAr: string;

  @IsString()
  titleEn: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent: number;

  @Type(() => Date)
  @IsDate()
  startsAt: Date;

  @Type(() => Date)
  @IsDate()
  endsAt: Date;
}
