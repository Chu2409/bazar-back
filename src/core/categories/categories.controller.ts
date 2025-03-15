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
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoriesFiltersDto } from './dto/categories-filters.dto'
import { CategoriesSearchDto } from './dto/search-dto'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get('search')
  getBySearch(@Query() dto: CategoriesSearchDto) {
    return this.service.getBySearch(dto)
  }

  @Post()
  create(@Body() createDto: CreateCategoryDto) {
    return this.service.create(createDto)
  }

  @Get()
  findAll(@Query() paginationDto: CategoriesFiltersDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id/toggle-status')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.service.toggleStatus(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCategoryDto,
  ) {
    return this.service.update(id, updateDto)
  }
}
