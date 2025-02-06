import { Injectable } from '@nestjs/common'
import { CreatePersonDto } from './dto/create-person.dto'
import { UpdatePersonDto } from './dto/update-person.dto'
import { Person } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { BaseService } from 'src/common/services/base.service'
@Injectable()
export class PeopleService extends BaseService<
  Person,
  CreatePersonDto,
  UpdatePersonDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'person')
  }
}
