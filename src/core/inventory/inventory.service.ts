import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { InventoryFiltersDto } from './dto/req/inventory-filters.dto'
import {
  convertToFilterWhere,
  convertToStatusWhere,
} from 'src/common/utils/converters'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { CreateInventoryDto } from './dto/req/create-inventory.dto'
import { UpdateInventoryDto } from './dto/req/update-inventory.dto'
import { InventorySearchDto } from './dto/req/inventory-search.dto'
import { InventoryResDto } from './dto/res/inventory-res.dto'
import { IApiPaginatedRes } from 'src/common/types/api-response.interface'

@Injectable()
export class InventoryService {
  constructor(private readonly prismaService: PrismaService) {}

  include: Prisma.SelectSubset<
    Prisma.InventoryInclude,
    Prisma.InventoryInclude
  > = {
    product: {
      include: {
        category: true,
      },
      omit: {
        categoryId: true,
      },
    },
    supplier: true,
  }

  private whereClause = (search?: string): Prisma.InventoryWhereInput => ({
    OR: [
      {
        product: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      {
        product: {
          barcode: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
    ],
  })

  async getBySearch({
    search,
  }: InventorySearchDto): Promise<InventoryResDto[]> {
    // @ts-expect-error type
    return await this.prismaService.inventory.findMany({
      where: this.whereClause(search),
      orderBy: {
        id: 'desc',
      },
      include: this.include,
      omit: {
        productId: true,
        supplierId: true,
      },
      take: 10,
    })
  }

  async create(dto: CreateInventoryDto) {
    const success = await this.prismaService.inventory.create({
      data: {
        ...dto,
        stock: dto.stock || dto.purchasedQty,
      },
    })

    return !!success
  }

  async update(id: number, dto: UpdateInventoryDto) {
    await this.findOne(id)

    const success = await this.prismaService.inventory.update({
      where: {
        id,
      },
      data: {
        ...dto,
        stock: dto.stock || dto.purchasedQty,
      },
    })

    return !!success
  }

  async findOne(id: number) {
    const inventory = await this.prismaService.inventory.findUnique({
      where: {
        id,
      },
    })

    if (!inventory)
      throw new NotFoundException(`Inventory with id ${id} not found`)

    return inventory
  }

  async findAll({
    limit,
    page,
    search,
    status,
    categoryId,
  }: InventoryFiltersDto): Promise<IApiPaginatedRes<InventoryResDto>> {
    const whereClause: Prisma.InventoryWhereInput = {
      ...this.whereClause(search),
      product: {
        categoryId: {
          in: convertToFilterWhere(categoryId),
        },
        active: convertToStatusWhere(status),
      },
    }

    const [entities, total] = await Promise.all([
      this.prismaService.inventory.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        include: this.include,
        orderBy: {
          id: 'desc',
        },
        omit: {
          productId: true,
          supplierId: true,
        },
      }),
      this.prismaService.inventory.count({
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

  async remove(id: number) {
    const exists = await this.prismaService.item.findFirst({
      where: {
        inventoryId: id,
      },
    })

    if (exists)
      throw new DisplayableException(
        'No se puede eliminar el inventario porque tiene items asociados',
        HttpStatus.BAD_REQUEST,
      )

    const success = await this.prismaService.inventory.delete({
      where: {
        id,
      },
    })

    return !!success
  }
}
