import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateSupplierDto } from './dto/create.dto'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { SuppliersFiltersDto } from './dto/filters.dto'
import { convertToStatusWhere } from 'src/common/utils/converters'
import { SuppliersSearchDto } from './dto/search.dto'

@Injectable()
export class SuppliersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBySearch({ search }: SuppliersSearchDto) {
    return this.prismaService.supplier.findMany({
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

  async findAll({ limit, page, search, status }: SuppliersFiltersDto) {
    const whereClause: Prisma.SupplierWhereInput = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
      active: convertToStatusWhere(status),
    }

    const [entities, total] = await Promise.all([
      this.prismaService.supplier.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: whereClause,
        orderBy: {
          id: 'desc',
        },
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

  async create(dto: CreateSupplierDto) {
    return await this.prismaService.supplier.create({
      data: dto,
    })
  }

  async update(id: number, dto: Prisma.SupplierUpdateInput) {
    await this.findOne(id)

    return await this.prismaService.supplier.update({
      where: { id },
      data: dto,
    })
  }

  async findOne(id: number) {
    const entity = await this.prismaService.supplier.findUnique({
      where: { id },
    })

    if (!entity) {
      throw new NotFoundException(`Supplier with id ${id} not found`)
    }

    return entity
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
