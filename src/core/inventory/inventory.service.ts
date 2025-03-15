import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { Lot, Prisma } from '@prisma/client'
import { isValidField, isValidSortOrder } from 'src/common/utils/validators'
import { InventoryFiltersDto } from './dto/inventory-filters.dto'
import {
  convertToFilterWhere,
  convertToStatusWhere,
} from 'src/common/utils/converters'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { CreateInventoryDto } from './dto/create-inventory.dto'
import { UpdateInventoryDto } from './dto/update-inventory.dto'
import { BaseService } from 'src/common/services/base.service'
import { InventorySearchDto } from './dto/search-dto'

@Injectable()
export class InventoryService extends BaseService<
  Lot,
  CreateInventoryDto,
  UpdateInventoryDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'lot')
  }

  include: Prisma.SelectSubset<Prisma.LotInclude, Prisma.LotInclude> = {
    product: {
      include: {
        category: true,
      },
    },
    supplier: true,
  }

  async getBySearch({ search }: InventorySearchDto) {
    return this.prismaService.lot.findMany({
      where: {
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
      },
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
    const inventory = await this.prismaService.lot.create({
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

    const inventory = await this.prismaService.lot.update({
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

  async findAll({
    limit,
    page,
    order,
    search,
    sort,
    status,
    barcode,
    categoryId,
  }: InventoryFiltersDto) {
    const whereClause: Prisma.LotWhereInput = {
      ...(search && {
        product: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      ...(barcode && {
        barcode: {
          contains: barcode,
          mode: 'insensitive',
        },
      }),
      product: {
        categoryId: {
          in: convertToFilterWhere(categoryId),
        },
        active: convertToStatusWhere(status),
      },
    }

    const orderBy: Prisma.LotOrderByWithRelationInput =
      isValidField(sort, this.prismaService.lot.fields) &&
      isValidSortOrder(order)
        ? {
            [sort as string]: order!.toLowerCase(),
          }
        : {
            id: 'desc',
          }

    const [entities, total] = await Promise.all([
      this.prismaService.lot.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        include: this.include,
        orderBy,
      }),
      this.prismaService.lot.count({
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
        lotId: id,
      },
    })

    if (exists)
      throw new DisplayableException(
        'No se puede eliminar el lote porque tiene items asociados',
        HttpStatus.BAD_REQUEST,
      )

    return this.prismaService.lot.delete({
      where: {
        id,
      },
    })
  }
}
