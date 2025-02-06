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
import { LotsService } from './lots.service'
import { CreateLotDto } from './dto/create-lot.dto'
import { UpdateLotDto } from './dto/update-lot.dto'
import { PaginationDto } from 'src/common/dtos/pagination.dto'

@Controller('lots')
export class LotsController {
  constructor(private readonly service: LotsService) {}

  @Post()
  create(@Body() createDto: CreateLotDto) {
    return this.service.create(createDto)
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLotDto,
  ) {
    return this.service.update(id, updateDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
