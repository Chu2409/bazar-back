import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { BaseService } from 'src/common/services/base.service'
import { Product } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { ProductsFiltersDto } from './dto/filters.dto'
import { convertStatus } from 'src/common/utils/params'

@Injectable()
export class ProductsService extends BaseService<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'product')
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
    const active = convertStatus(status)

    const [entities, total] = await Promise.all([
      this.prismaService.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          name: {
            contains: search,
          },
          categoryId,
          active,
        },
        orderBy: {
          [sort || 'id']: order || 'desc',
        },
      }),
      this.prismaService.product.count({
        where: {
          name: {
            contains: search,
          },
          categoryId,
          active,
        },
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
}
