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
import { CustomersService } from './customers.service'
import { CreateCustomerDto } from './dto/req/create-customer.dto'
import { UpdateCustomerDto } from './dto/req/update-customer.dto'
import { CustomersFiltersDto } from './dto/req/customer-filters.dto'
import { CustomersSearchDto } from './dto/req/customer-search.dto'

@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Get('search')
  getBySearch(@Query() dto: CustomersSearchDto) {
    return this.service.getBySearch(dto)
  }

  @Post()
  create(@Body() createDto: CreateCustomerDto) {
    return this.service.create(createDto)
  }

  @Get()
  findAll(@Query() paginationDto: CustomersFiltersDto) {
    return this.service.findAll(paginationDto)
  }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.service.findOne(id)
  // }

  @Patch(':id/toggle-status')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.service.toggleStatus(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCustomerDto,
  ) {
    return this.service.update(id, updateDto)
  }
}
