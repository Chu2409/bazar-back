// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Injectable, HttpStatus } from '@nestjs/common'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
import { IApiPaginatedRes } from 'src/common/types/api-response.interface'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { PrismaClient } from '@prisma/client'

@Injectable()
export abstract class BaseService<T, CreateDto, UpdateDto> {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly modelName: keyof PrismaClient,
  ) {}

  async create(createDto: CreateDto): Promise<T> {
    return await this.prismaService[this.modelName].create({
      data: createDto,
    })
  }

  async findAll({ limit, page }: PaginationDto): Promise<IApiPaginatedRes<T>> {
    const [entities, total] = await Promise.all([
      this.prismaService[this.modelName].findMany({
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prismaService[this.modelName].count(),
    ])

    return {
      records: entities,
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async findOne(id: number): Promise<T> {
    const entity = await this.prismaService[this.modelName].findUnique({
      where: { id },
    })

    if (!entity)
      throw new DisplayableException(
        `El registro con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      )

    return entity
  }

  async update(id: number, updateDto: UpdateDto): Promise<T> {
    await this.findOne(id)

    return await this.prismaService[this.modelName].update({
      where: { id },
      data: updateDto,
    })
  }

  async remove(id: number): Promise<T> {
    await this.findOne(id)

    return await this.prismaService[this.modelName].update({
      where: { id },
      data: { active: false },
    })
  }
}
