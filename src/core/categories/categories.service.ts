import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto } from './dto/req/create-category.dto'
import { UpdateCategoryDto } from './dto/req/update-category.dto'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { CategoriesFiltersDto } from './dto/req/category-filters.dto'
import { convertToStatusWhere } from 'src/common/utils/converters'
import { CategoriesSearchDto } from './dto/req/category-search.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { IApiPaginatedRes } from 'src/common/types/api-response.interface'
import { CategoryResDto } from './dto/res/category-res.dto'

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBySearch({
    search,
  }: CategoriesSearchDto): Promise<CategoryResDto[]> {
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

  async findAll({
    limit,
    page,
    search,
    status,
  }: CategoriesFiltersDto): Promise<IApiPaginatedRes<CategoryResDto>> {
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

  async findOne(id: number): Promise<CategoryResDto> {
    const entity = await this.prismaService.category.findUnique({
      where: { id },
    })

    if (!entity) throw new NotFoundException(`Category with id ${id} not found`)

    return entity
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResDto> {
    const alreadyExists = await this.prismaService.category.findUnique({
      where: {
        name: dto.name,
      },
    })

    if (alreadyExists)
      throw new DisplayableException(
        'Ya existe una categoría con ese nombre',
        HttpStatus.BAD_REQUEST,
      )

    return await this.prismaService.category.create({
      data: dto,
    })
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<CategoryResDto> {
    await this.findOne(id)

    const alreadyExists = await this.prismaService.category.findUnique({
      where: {
        name: dto.name,
        AND: {
          id: {
            not: id,
          },
        },
      },
    })

    if (alreadyExists)
      throw new DisplayableException(
        'Ya existe una categoría con ese nombre',
        HttpStatus.BAD_REQUEST,
      )

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
