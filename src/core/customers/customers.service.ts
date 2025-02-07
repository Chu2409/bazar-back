import { HttpStatus, Injectable } from '@nestjs/common'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Customer } from '@prisma/client'
import { BaseService } from 'src/common/services/base.service'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'

@Injectable()
export class CustomersService extends BaseService<
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'customer')
  }

  async create(createDto: CreateCustomerDto) {
    const customerAlreadyExists = await this.prismaService.customer.findFirst({
      where: {
        personId: createDto.personId,
      },
    })

    if (customerAlreadyExists)
      throw new DisplayableException(
        'Ya existe un cliente asociado a esta persona',
        HttpStatus.CONFLICT,
      )

    return super.create(createDto)
  }

  async update(id: number, updateDto: UpdateCustomerDto) {
    const customerAlreadyExists = await this.prismaService.customer.findFirst({
      where: {
        personId: updateDto.personId,
        NOT: {
          id,
        },
      },
    })

    if (customerAlreadyExists)
      throw new DisplayableException(
        'Ya existe un cliente asociado a esta persona',
        HttpStatus.CONFLICT,
      )

    return super.update(id, updateDto)
  }
}
