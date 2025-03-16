import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create.dto'
import { UpdateCategoryDto } from './dto/update.dto'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { CategoriesFiltersDto } from './dto/filters.dto'
import { convertToStatusWhere } from 'src/common/utils/converters'
import { CategoriesSearchDto } from './dto/search.dto'

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBySearch({ search }: CategoriesSearchDto) {
    return this.prismaService.category.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        id: 'desc',
      },
      take: 10,
    })
  }

  async findAll({ limit, page, search, status }: CategoriesFiltersDto) {
    const whereClause: Prisma.CategoryWhereInput = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
      active: convertToStatusWhere(status),
    }

    const [entities, total] = await Promise.all([
      this.prismaService.category.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        orderBy: {
          id: 'desc',
        },
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

  async findOne(id: number) {
    const entity = await this.prismaService.category.findUnique({
      where: { id },
    })

    if (!entity) throw new NotFoundException(`Category with id ${id} not found`)

    return entity
  }

  async create(dto: CreateCategoryDto) {
    return await this.prismaService.category.create({
      data: dto,
    })
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id)

    return await this.prismaService.category.update({
      where: { id },
      data: dto,
    })
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
