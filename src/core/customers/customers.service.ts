import { HttpStatus, Injectable } from '@nestjs/common'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Customer, Prisma } from '@prisma/client'
import { BaseService } from 'src/common/services/base.service'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { CustomersFiltersDto } from './dto/customers-filters.dto'
import { convertToStatusWhere } from 'src/common/utils/converters'
import { isValidField, isValidSortOrder } from 'src/common/utils/validators'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { CustomersSearchDto } from './dto/search-dto'

@Injectable()
export class CustomersService extends BaseService<
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'customer')
  }

  private include: Prisma.SelectSubset<
    Prisma.CustomerInclude,
    Prisma.CustomerInclude
  > = {
    person: {
      include: {
        identifications: true,
      },
    },
  }

  async getBySearch({ search }: CustomersSearchDto) {
    return this.prismaService.customer.findMany({
      where: {
        OR: [
          {
            person: {
              firstName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            person: {
              secondName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            person: {
              firstSurname: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            person: {
              secondSurname: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            person: {
              identifications: {
                some: {
                  value: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        ],
      },
      include: this.include,
      orderBy: {
        id: 'desc',
      },
      take: 10,
    })
  }

  async findAll({
    limit,
    page,
    order,
    search,
    sort,
    status,
  }: CustomersFiltersDto) {
    const whereClause: Prisma.CustomerWhereInput = {
      ...(search && {
        person: {
          identifications: {
            some: {
              value: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      }),
      active: convertToStatusWhere(status),
    }

    const orderBy: Prisma.CustomerOrderByWithRelationInput =
      isValidField(sort, this.prismaService.product.fields) &&
      isValidSortOrder(order)
        ? {
            [sort as string]: order!.toLowerCase(),
          }
        : {
            id: 'desc',
          }

    const [entities, total] = await Promise.all([
      this.prismaService.customer.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        include: this.include,
        orderBy,
      }),
      this.prismaService.customer.count({
        where: whereClause,
      }),
    ])

    return {
      records: entities,
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async create(createDto: CreateCustomerDto) {
    await this.existsByEmailOrIdentification(
      createDto.person.email,
      createDto.person.identifications.map((i) => i.value),
    )

    const customer = await this.prismaService.customer.create({
      data: {
        ...createDto,
        person: {
          create: {
            ...createDto.person,
            identifications: {
              createMany: { data: createDto.person.identifications },
            },
          },
        },
      },
      include: this.include,
    })

    return customer
  }

  async update(id: number, updateDto: UpdateCustomerDto) {
    await this.existsByEmailOrIdentification(
      updateDto.person?.email,
      updateDto.person?.identifications
        ?.map((i) => i.value)
        .filter((value): value is string => value !== undefined),
      id,
    )

    const updated = await this.prismaService.customer.update({
      where: { id },
      data: {
        ...updateDto,
        person: {
          update: {
            ...updateDto.person,
            identifications: {
              updateMany: updateDto.person?.identifications?.map((i) => ({
                where: { id: i.id },
                data: i,
              })),
            },
          },
        },
      },
      include: this.include,
    })

    return updated
  }

  async toggleStatus(id: number): Promise<boolean> {
    const entity = await this.findOne(id)

    const success = await this.prismaService.customer.update({
      where: { id },
      data: {
        active: !entity.active,
      },
    })

    return !!success
  }

  private async existsByEmailOrIdentification(
    email?: string,
    identifications: string[] = [],
    id?: number,
  ) {
    const exists = await this.prismaService.customer.findFirst({
      where: {
        id: {
          not: id,
        },
        person: {
          OR: [
            {
              email: {
                equals: email,
              },
            },
            {
              identifications: {
                some: {
                  value: {
                    in: identifications,
                  },
                },
              },
            },
          ],
        },
      },
    })

    if (exists)
      throw new DisplayableException(
        'Un cliente con este correo o número de identificación ya existe',
        HttpStatus.CONFLICT,
      )
  }
}
