import {
  ParseIntPipe,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { BaseService } from 'src/common/services/base.service'
import { PaginationDto } from 'src/common/dtos/pagination.dto'

@Controller()
export class BaseController<T, CreateDto, UpdateDto> {
  constructor(
    private readonly baseService: BaseService<T, CreateDto, UpdateDto>,
  ) {}

  @Post()
  create(@Body() createDto: CreateDto) {
    return this.baseService.create(createDto)
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.baseService.findAll(paginationDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.baseService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateDto) {
    return this.baseService.update(id, updateDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.baseService.remove(id)
  }
}
