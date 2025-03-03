import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category, Prisma } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { BaseService } from 'src/common/services/base.service'
import { CategoriesFiltersDto } from './dto/categories-filters.dto'
import { convertToStatusWhere } from 'src/common/utils/converters'
import { isValidField, isValidSortOrder } from 'src/common/utils/validators'

@Injectable()
export class CategoriesService extends BaseService<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'category')
  }

  async findAll({
    limit,
    page,
    order,
    search,
    sort,
    status,
  }: CategoriesFiltersDto) {
    const whereClause: Prisma.CategoryWhereInput = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
      active: convertToStatusWhere(status),
    }

    const orderBy: Prisma.CategoryOrderByWithRelationInput =
      isValidField(sort, this.prismaService.product.fields) &&
      isValidSortOrder(order)
        ? {
            [sort as string]: order!.toLowerCase(),
          }
        : {
            id: 'desc',
          }

    const [entities, total] = await Promise.all([
      this.prismaService.category.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        orderBy,
      }),
      this.prismaService.category.count({
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

    const success = await this.prismaService.category.update({
      where: { id },
      data: {
        active: !entity.active,
      },
    })

    return !!success
  }
}
