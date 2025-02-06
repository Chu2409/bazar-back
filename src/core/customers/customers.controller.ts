import { Controller } from '@nestjs/common'
import { CustomersService } from './customers.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { BaseController } from 'src/common/controllers/base.controller'
import { Customer } from '@prisma/client'

@Controller('customers')
export class CustomersController extends BaseController<
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto
> {
  constructor(private readonly customersService: CustomersService) {
    super(customersService)
  }
}
