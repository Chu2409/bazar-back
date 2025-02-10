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
import { PeopleService } from './people.service'
import { CreatePersonDto } from './dto/create-person.dto'
import { UpdatePersonDto } from './dto/update-person.dto'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

@Controller('people')
export class PeopleController {
  constructor(private readonly service: PeopleService) {}

  @Post()
  create(@Body() createDto: CreatePersonDto) {
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
    @Body() updateDto: UpdatePersonDto,
  ) {
    return this.service.update(id, updateDto)
  }
}
