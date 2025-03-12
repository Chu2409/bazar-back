import { Injectable } from '@nestjs/common'
import { CreateSaleDto } from './dto/create-sale.dto'
import { UpdateSaleDto } from './dto/update-sale.dto'
import { BaseService } from 'src/common/services/base.service'
import { Prisma, Sale } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { SalesFiltersDto } from './dto/sales-filters.dto'
import { isValidField, isValidSortOrder } from 'src/common/utils/validators'

@Injectable()
export class SalesService extends BaseService<
  Sale,
  CreateSaleDto,
  UpdateSaleDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'sale')
  }

  private include: Prisma.SelectSubset<Prisma.SaleInclude, Prisma.SaleInclude> =
    {
      customer: {
        include: {
          person: {
            include: {
              identifications: true,
            },
          },
        },
      },
      items: {
        include: {
          lot: {
            include: {
              product: true,
            },
          },
        },
      },
    }

  async findAll({ limit, page, order, search, sort }: SalesFiltersDto) {
    const whereClause: Prisma.SaleWhereInput = {
      ...(search && {
        customer: {
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
      }),
    }

    const orderBy: Prisma.SaleOrderByWithRelationInput =
      isValidField(sort, this.prismaService.product.fields) &&
      isValidSortOrder(order)
        ? {
            [sort as string]: order!.toLowerCase(),
          }
        : {
            id: 'desc',
          }

    const [entities, total] = await Promise.all([
      this.prismaService.sale.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        include: this.include,
        orderBy,
      }),
      this.prismaService.sale.count({
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

  async create(createDto: CreateSaleDto) {
    const entity = await this.prismaService.sale.create({
      data: {
        ...createDto,
        items: {
          createMany: { data: createDto.items },
        },
      },
      include: this.include,
    })

    return entity
  }

  async update(id: number, updateDto: UpdateSaleDto) {
    const entity = await this.prismaService.sale.update({
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
      include: this.include,
    })

    return entity
  }
}
