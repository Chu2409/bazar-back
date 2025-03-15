import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create.dto'
import { UpdateUserDto } from './dto/update.dto'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { hashPassword } from 'src/common/utils/encrypter'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({ limit, page }: BaseParamsDto) {
    const [entities, total] = await Promise.all([
      this.prismaService.supplier.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          id: 'desc',
        },
      }),
      this.prismaService.supplier.count({}),
    ])

    return {
      records: entities,
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    }
  }

  async create(createDto: CreateUserDto) {
    const alreadyExistPersonAssociated =
      await this.prismaService.user.findUnique({
        where: { personId: createDto.personId },
      })

    if (alreadyExistPersonAssociated)
      throw new DisplayableException(
        'Ya existe una persona asociada a este usuario',
        HttpStatus.CONFLICT,
      )

    const hashedPassword = hashPassword(createDto.password)

    return await this.prismaService.user.create({
      data: {
        ...createDto,
        password: hashedPassword,
      },
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id)

    if (updateUserDto.personId) {
      const alreadyExistPersonAssociated =
        await this.prismaService.user.findUnique({
          where: { personId: updateUserDto.personId, NOT: { id } },
        })

      if (alreadyExistPersonAssociated)
        throw new DisplayableException(
          'Ya existe una persona asociada a este usuario',
          HttpStatus.CONFLICT,
        )
    }

    const hashedPassword =
      updateUserDto.password && hashPassword(updateUserDto.password)

    return await this.prismaService.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: hashedPassword,
      },
    })
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } })

    if (!user) throw new NotFoundException(`User with id ${id} not found`)

    return user
  }
}
