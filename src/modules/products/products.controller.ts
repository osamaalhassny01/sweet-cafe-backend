import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findPublic(query);
  }

  @Get('featured')
  findFeatured(@Query() query: ProductQueryDto) {
    return this.productsService.findPublic({ ...query, isFeatured: true });
  }

  @Get('best-sellers')
  findBestSellers(@Query() query: ProductQueryDto) {
    return this.productsService.findPublic({ ...query, isBestSeller: true });
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string, @Query() query: ProductQueryDto) {
    return this.productsService.findPublic({ ...query, categoryId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findPublicById(id);
  }
}
