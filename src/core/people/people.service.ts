import { Injectable } from '@nestjs/common'
import { CreatePersonDto } from './dto/create-person.dto'
import { UpdatePersonDto } from './dto/update-person.dto'
import { Person } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { CrudService } from 'src/common/services/crud.service'
@Injectable()
export class PeopleService extends CrudService<
  Person,
  CreatePersonDto,
  UpdatePersonDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'person')
  }
}
