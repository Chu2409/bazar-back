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
import { SuppliersService } from './suppliers.service'
import { CreateSupplierDto } from './dto/req/create-supplier.dto'
import { UpdateSupplierDto } from './dto/req/update-supplier.dto'
import { SuppliersFiltersDto } from './dto/req/suppliers-filters.dto'
import { SuppliersSearchDto } from './dto/req/supplier-search.dto'
import { ApiMessage } from 'src/common/decorators/api-message.decorator'

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}

  @Get('search')
  getBySearch(@Query() dto: SuppliersSearchDto) {
    return this.service.getBySearch(dto)
  }

  @Post()
  @ApiMessage('Proveedor creado correctamente')
  create(@Body() createDto: CreateSupplierDto) {
    return this.service.create(createDto)
  }

  @Get()
  findAll(@Query() paginationDto: SuppliersFiltersDto) {
    return this.service.findAll(paginationDto)
  }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.service.findOne(id)
  // }

  @Patch(':id/toggle-status')
  @ApiMessage('Proveedor actualizado correctamente')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.service.toggleStatus(id)
  }

  @Patch(':id')
  @ApiMessage('Proveedor actualizado correctamente')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSupplierDto,
  ) {
    return this.service.update(id, updateDto)
  }
}
