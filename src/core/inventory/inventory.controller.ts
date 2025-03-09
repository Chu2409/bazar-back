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
import { InventoryFiltersDto } from './dto/inventory-filters.dto'
import { CreateInventoryDto } from './dto/create-inventory.dto'
import { UpdateInventoryDto } from './dto/update-inventory.dto'

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto)
  }

  @Get()
  findAll(@Query() paginationDto: InventoryFiltersDto) {
    return this.inventoryService.findAll(paginationDto)
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.inventoryService.findOne(+id)
  // }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.remove(id)
  }
}
