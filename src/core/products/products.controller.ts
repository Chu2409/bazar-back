import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/req/create-product.dto'
import { UpdateProductDto } from './dto/req/update-product.dto'
import { ProductsFiltersDto } from './dto/req/product-filters.dto'
import { ProductsSearchDto } from './dto/req/product-search-dto'

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get('search')
  getBySearch(@Query() dto: ProductsSearchDto) {
    return this.service.getBySearch(dto)
  }

  @Post()
  create(@Body() createDto: CreateProductDto) {
    return this.service.create(createDto)
  }

  @Get()
  findAll(@Query() paginationDto: ProductsFiltersDto) {
    return this.service.findAll(paginationDto)
  }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.service.findOne(id)
  // }

  @Patch(':id/toggle-status')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.service.toggleStatus(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductDto,
  ) {
    return this.service.update(id, updateDto)
  }
}
