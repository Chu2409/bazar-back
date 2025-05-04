import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { ProductsFiltersDto } from './dto/req/product-filters.dto'
import {
  convertToFilterWhere,
  convertToStatusWhere,
} from 'src/common/utils/converters'
import { ProductsSearchDto } from './dto/req/product-search-dto'
import { CreateProductDto } from './dto/req/create-product.dto'
import { UpdateProductDto } from './dto/req/update-product.dto'
import { ProductResDto } from './dto/res/product-res.dto'
import { SimpleProductResDto } from './dto/res/simple-product-res.dto'
import { IApiPaginatedRes } from 'src/common/types/api-response.interface'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBySearch({
    search,
  }: ProductsSearchDto): Promise<SimpleProductResDto[]> {
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
      omit: {
        categoryId: true,
      },
    })
  }

  async findAll({
    limit,
    page,
    search,
    categoryId,
    status,
  }: ProductsFiltersDto): Promise<IApiPaginatedRes<ProductResDto>> {
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

    const [entities, total] = await Promise.all([
      this.prismaService.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        include: {
          category: true,
        },
        orderBy: {
          id: 'desc',
        },
        omit: {
          categoryId: true,
        },
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

  async create(dto: CreateProductDto): Promise<SimpleProductResDto> {
    const alreadyExists = await this.prismaService.product.findUnique({
      where: {
        barcode: dto.barcode,
      },
    })

    if (alreadyExists)
      throw new DisplayableException(
        'Ya existe un producto con ese nombre',
        HttpStatus.BAD_REQUEST,
      )

    return await this.prismaService.product.create({
      data: dto,
      omit: {
        categoryId: true,
      },
    })
  }

  async update(
    id: number,
    dto: UpdateProductDto,
  ): Promise<SimpleProductResDto> {
    await this.findOne(id)

    const alreadyExists = await this.prismaService.product.findUnique({
      where: {
        barcode: dto.barcode,
        AND: {
          id: {
            not: id,
          },
        },
      },
    })

    if (alreadyExists)
      throw new DisplayableException(
        'Ya existe un producto con ese nombre',
        HttpStatus.BAD_REQUEST,
      )

    return await this.prismaService.product.update({
      where: { id },
      data: dto,
      omit: {
        categoryId: true,
      },
    })
  }

  async findOne(id: number): Promise<SimpleProductResDto> {
    const entity = await this.prismaService.product.findUnique({
      where: { id },
      omit: {
        categoryId: true,
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
