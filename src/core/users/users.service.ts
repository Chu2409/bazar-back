import { HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from '@prisma/client'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { hashPassword } from 'src/common/utils/encrypter'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { BaseService } from 'src/common/services/base.service'

@Injectable()
export class UsersService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'user')
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
}
