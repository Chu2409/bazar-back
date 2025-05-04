import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateSaleDto } from './dto/req/create-sale.dto'
import { UpdateSaleDto } from './dto/req/update-sale.dto'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { SalesFiltersDto } from './dto/req/sale-filters.dto'
import { IApiPaginatedRes } from 'src/common/types/api-response.interface'
import { SaleResDto } from './dto/res/sale-res.dto'

@Injectable()
export class SalesService {
  constructor(private readonly prismaService: PrismaService) {}

  private include: Prisma.SelectSubset<Prisma.SaleInclude, Prisma.SaleInclude> =
    {
      customer: {
        include: {
          person: {
            include: {
              identifications: {
                omit: {
                  personId: true,
                },
              },
            },
          },
        },
        omit: {
          personId: true,
        },
      },
      items: {
        include: {
          inventory: {
            include: {
              product: {
                omit: {
                  categoryId: true,
                },
              },
            },
            omit: {
              productId: true,
              supplierId: true,
            },
          },
        },
        omit: {
          inventoryId: true,
          saleId: true,
        },
      },
    }

  private whereClause = (search?: string): Prisma.SaleWhereInput => ({
    customer: {
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
  })

  async findAll({
    limit,
    page,
    search,
  }: SalesFiltersDto): Promise<IApiPaginatedRes<SaleResDto>> {
    const whereClause: Prisma.SaleWhereInput = {
      ...this.whereClause(search),
    }

    const [entities, total] = await Promise.all([
      this.prismaService.sale.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        include: this.include,
        orderBy: {
          id: 'desc',
        },
        omit: {
          customerId: true,
        },
      }),
      this.prismaService.sale.count({
        where: whereClause,
      }),
    ])

    return {
      // @ts-expect-error type
      records: entities,
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number) {
    const entity = await this.prismaService.sale.findUnique({
      where: { id },
    })

    if (!entity) {
      throw new NotFoundException(`Sale with id ${id} not found`)
    }

    return entity
  }

  async create(createDto: CreateSaleDto) {
    const success = await this.prismaService.sale.create({
      data: {
        ...createDto,
        items: {
          createMany: { data: createDto.items },
        },
      },
    })

    return !!success
  }

  async update(id: number, updateDto: UpdateSaleDto) {
    await this.findOne(id)

    const success = await this.prismaService.sale.update({
      where: { id },
      data: {
        ...updateDto,
        items: {
          updateMany: updateDto.items?.map((i) => ({
            where: { id: i.id },
            data: i,
          })),
        },
      },
    })

    return !!success
  }
}
