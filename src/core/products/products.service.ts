import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { ProductsFiltersDto } from './dto/filters.dto'
import {
  convertToFilterWhere,
  convertToStatusWhere,
} from 'src/common/utils/converters'
import { isValidField, isValidSortOrder } from 'src/common/utils/validators'
import { ProductsSearchDto } from './dto/search-dto'
import { CreateProductDto } from './dto/create.dto'
import { UpdateProductDto } from './dto/update.dto'

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBySearch({ search }: ProductsSearchDto) {
    return await this.prismaService.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            barcode: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
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
    categoryId,
    status,
  }: ProductsFiltersDto) {
    const whereClause: Prisma.ProductWhereInput = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
      categoryId: {
        in: convertToFilterWhere(categoryId),
      },
      active: convertToStatusWhere(status),
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      isValidField(sort, this.prismaService.product.fields) &&
      isValidSortOrder(order)
        ? {
            [sort as string]: order!.toLowerCase(),
          }
        : {
            id: 'desc',
          }

    const [entities, total] = await Promise.all([
      this.prismaService.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        include: {
          category: true,
        },
        orderBy,
      }),
      this.prismaService.product.count({
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

  async create(dto: CreateProductDto) {
    return await this.prismaService.product.create({
      data: dto,
    })
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id)

    return await this.prismaService.product.update({
      where: { id },
      data: dto,
    })
  }

  async findOne(id: number) {
    const entity = await this.prismaService.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!entity) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }

    return entity
  }

  async toggleStatus(id: number): Promise<boolean> {
    const entity = await this.findOne(id)

    const success = await this.prismaService.product.update({
      where: { id },
      data: {
        active: !entity.active,
      },
    })

    return !!success
  }
}
