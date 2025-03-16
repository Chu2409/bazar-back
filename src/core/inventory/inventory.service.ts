import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { InventoryFiltersDto } from './dto/filters.dto'
import {
  convertToFilterWhere,
  convertToStatusWhere,
} from 'src/common/utils/converters'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { CreateInventoryDto } from './dto/create.dto'
import { UpdateInventoryDto } from './dto/update.dto'
import { InventorySearchDto } from './dto/search.dto'

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

  async getBySearch({ search }: InventorySearchDto) {
    return await this.prismaService.inventory.findMany({
      where: this.whereClause(search),
      orderBy: {
        id: 'desc',
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      take: 10,
    })
  }

  async create(dto: CreateInventoryDto) {
    const inventory = await this.prismaService.inventory.create({
      data: {
        ...dto,
        stock: dto.stock || dto.purchasedQty,
      },
      include: this.include,
    })

    return inventory
  }

  async update(id: number, dto: UpdateInventoryDto) {
    await this.findOne(id)

    const inventory = await this.prismaService.inventory.update({
      where: {
        id,
      },
      data: {
        ...dto,
        stock: dto.stock || dto.purchasedQty,
      },
      include: this.include,
    })

    return inventory
  }

  async findOne(id: number) {
    const inventory = await this.prismaService.inventory.findUnique({
      where: {
        id,
      },
      include: this.include,
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
  }: InventoryFiltersDto) {
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
      }),
      this.prismaService.inventory.count({
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

    return this.prismaService.inventory.delete({
      where: {
        id,
      },
    })
  }
}
