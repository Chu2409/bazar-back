import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { InventoryFiltersDto } from './dto/inventory-filters.dto'

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // @Post()
  // create(@Body() createInventoryDto: CreateInventoryDto) {
  //   return this.inventoryService.create(createInventoryDto)
  // }

  @Get()
  findAll(@Query() paginationDto: InventoryFiltersDto) {
    return this.inventoryService.findAll(paginationDto)
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.inventoryService.findOne(+id)
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateInventoryDto: UpdateInventoryDto,
  // ) {
  //   return this.inventoryService.update(+id, updateInventoryDto)
  // }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.remove(id)
  }
}
