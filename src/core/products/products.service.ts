import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { BaseService } from 'src/common/services/base.service'
import { Prisma, Product } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { ProductsFiltersDto } from './dto/products-filters.dto'
import {
  convertToFilterWhere,
  convertToStatusWhere,
} from 'src/common/utils/converters'
import { isValidField, isValidSortOrder } from 'src/common/utils/validators'
import { ProductsSearchDto } from './dto/search-dto'

@Injectable()
export class ProductsService extends BaseService<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'product')
  }

  async getBySearch({ search }: ProductsSearchDto) {
    return this.prismaService.product.findMany({
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
