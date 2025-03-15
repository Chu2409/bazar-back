import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { InventoryFiltersDto } from './dto/filters.dto'
import { CreateInventoryDto } from './dto/create.dto'
import { UpdateInventoryDto } from './dto/update.dto'
import { InventorySearchDto } from './dto/search.dto'

@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get('search')
  getBySearch(@Query() dto: InventorySearchDto) {
    return this.service.getBySearch(dto)
  }

  @Post()
  create(@Body() dto: CreateInventoryDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll(@Query() paginationDto: InventoryFiltersDto) {
    return this.service.findAll(paginationDto)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.service.update(id, updateInventoryDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
