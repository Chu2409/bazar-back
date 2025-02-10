import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { IdentificationsService } from './identifications.service'
import { CreateIdentificationDto } from './dto/create-identification.dto'
import { UpdateIdentificationDto } from './dto/update-identification.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

@Controller('identifications')
export class IdentificationsController {
  constructor(private readonly service: IdentificationsService) {}

  @Post()
  create(@Body() createDto: CreateIdentificationDto) {
    return this.service.create(createDto)
  }

  @Get()
  findAll(@Query() paginationDto: BaseParamsDto) {
    return this.service.findAll(paginationDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateIdentificationDto,
  ) {
    return this.service.update(id, updateDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
