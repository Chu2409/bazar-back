import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateSaleDto } from './dto/create.dto'
import { UpdateSaleDto } from './dto/update.dto'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { SalesFiltersDto } from './dto/sales.dto'
import { isValidField, isValidSortOrder } from 'src/common/utils/validators'

@Injectable()
export class SalesService {
  constructor(private readonly prismaService: PrismaService) {}

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
          inventory: {
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

  async findOne(id: number) {
    const entity = await this.prismaService.sale.findUnique({
      where: { id },
      include: this.include,
    })

    if (!entity) {
      throw new NotFoundException(`Sale with id ${id} not found`)
    }

    return entity
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
    await this.findOne(id)

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
