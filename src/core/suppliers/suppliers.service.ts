import { Injectable } from '@nestjs/common'
import { CreateSupplierDto } from './dto/create-supplier.dto'
import { UpdateSupplierDto } from './dto/update-supplier.dto'
import { BaseService } from 'src/common/services/base.service'
import { Prisma, Supplier } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { SuppliersFiltersDto } from './dto/suppliers-filters.dto'
import { convertToStatusWhere } from 'src/common/utils/converters'
import { isValidField, isValidSortOrder } from 'src/common/utils/validators'

@Injectable()
export class SuppliersService extends BaseService<
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'supplier')
  }

  async findAll({
    limit,
    page,
    order,
    search,
    sort,
    status,
  }: SuppliersFiltersDto) {
    const whereClause: Prisma.SupplierWhereInput = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
      active: convertToStatusWhere(status),
    }

    const orderBy: Prisma.SupplierOrderByWithRelationInput =
      isValidField(sort, this.prismaService.product.fields) &&
      isValidSortOrder(order)
        ? {
            [sort as string]: order!.toLowerCase(),
          }
        : {
            id: 'desc',
          }

    const [entities, total] = await Promise.all([
      this.prismaService.supplier.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        orderBy,
      }),
      this.prismaService.supplier.count({
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

    const success = await this.prismaService.supplier.update({
      where: { id },
      data: {
        active: !entity.active,
      },
    })

    return !!success
  }
}
