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
import { SalesService } from './sales.service'
import { CreateSaleDto } from './dto/req/create-sale.dto'
import { UpdateSaleDto } from './dto/req/update-sale.dto'
import { SalesFiltersDto } from './dto/req/sale-filters.dto'
import { ApiMessage } from 'src/common/decorators/api-message.decorator'

@Controller('sales')
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @Post()
  @ApiMessage('Venta creada correctamente')
  create(@Body() createDto: CreateSaleDto) {
    return this.service.create(createDto)
  }

  @Get()
  findAll(@Query() paginationDto: SalesFiltersDto) {
    return this.service.findAll(paginationDto)
  }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.service.findOne(id)
  // }

  @Patch(':id')
  @ApiMessage('Venta actualizada correctamente')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSaleDto,
  ) {
    return this.service.update(id, updateDto)
  }
}
