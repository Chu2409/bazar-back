import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCustomerDto } from './dto/create.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { CustomersFiltersDto } from './dto/filters.dto'
import { convertToStatusWhere } from 'src/common/utils/converters'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { CustomersSearchDto } from './dto/search.dto'

@Injectable()
export class CustomersService {
  constructor(private readonly prismaService: PrismaService) {}

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

  private whereClause = (search?: string): Prisma.CustomerWhereInput => ({
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
  })

  async getBySearch({ search }: CustomersSearchDto) {
    return this.prismaService.customer.findMany({
      where: this.whereClause(search),
      include: this.include,
      orderBy: {
        id: 'desc',
      },
      take: 10,
    })
  }

  async findAll({ limit, page, search, status }: CustomersFiltersDto) {
    const whereClause: Prisma.CustomerWhereInput = {
      ...this.whereClause(search),
      active: convertToStatusWhere(status),
    }

    const [entities, total] = await Promise.all([
      this.prismaService.customer.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        include: this.include,
        orderBy: {
          id: 'desc',
        },
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

  async create(dto: CreateCustomerDto) {
    await this.existsByEmailOrIdentification(
      dto.person.email,
      dto.person.identifications.map((i) => i.value),
    )

    const customer = await this.prismaService.customer.create({
      data: {
        ...dto,
        person: {
          create: {
            ...dto.person,
            identifications: {
              createMany: { data: dto.person.identifications },
            },
          },
        },
      },
      include: this.include,
    })

    return customer
  }

  async update(id: number, dto: UpdateCustomerDto) {
    await this.existsByEmailOrIdentification(
      dto.person?.email,
      dto.person?.identifications
        ?.map((i) => i.value)
        .filter((value): value is string => value !== undefined),
      id,
    )

    const updated = await this.prismaService.customer.update({
      where: { id },
      data: {
        ...dto,
        person: {
          update: {
            ...dto.person,
            identifications: {
              updateMany: dto.person?.identifications?.map((i) => ({
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

  async findOne(id: number) {
    const entity = await this.prismaService.customer.findUnique({
      where: { id },
    })

    if (!entity) throw new NotFoundException(`Customer with id ${id} not found`)

    return entity
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
