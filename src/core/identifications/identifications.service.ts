import { HttpStatus, Injectable } from '@nestjs/common'
import { CreateIdentificationDto } from './dto/create-identification.dto'
import { UpdateIdentificationDto } from './dto/update-identification.dto'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { BaseService } from 'src/common/services/base.service'
import { Identification } from '@prisma/client'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'

@Injectable()
export class IdentificationsService extends BaseService<
  Identification,
  CreateIdentificationDto,
  UpdateIdentificationDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'identification')
  }

  async create(createDto: CreateIdentificationDto) {
    const identificationAlreadyExists =
      await this.prismaService.identification.findFirst({
        where: { value: createDto.value, type: createDto.type },
      })

    if (identificationAlreadyExists)
      throw new DisplayableException(
        'Esta identificación ya existe',
        HttpStatus.CONFLICT,
      )

    return super.create(createDto)
  }

  async update(id: number, updateDto: UpdateIdentificationDto) {
    const identificationAlreadyExists =
      await this.prismaService.identification.findFirst({
        where: { value: updateDto.value, type: updateDto.type },
      })

    if (identificationAlreadyExists)
      throw new DisplayableException(
        'Esta identificación ya existe',
        HttpStatus.CONFLICT,
      )

    return super.update(id, updateDto)
  }

  async remove(id: number) {
    const identification = await this.findOne(id)

    await this.prismaService.identification.delete({
      where: { id },
    })

    return identification
  }
}
