import { Controller, ForbiddenException } from '@nestjs/common'
import { PeopleService } from './people.service'
import { CreatePersonDto } from './dto/create-person.dto'
import { UpdatePersonDto } from './dto/update-person.dto'
import { BaseController } from 'src/common/controllers/base.controller'
import { Person } from '@prisma/client'

@Controller('people')
export class PeopleController extends BaseController<
  Person,
  CreatePersonDto,
  UpdatePersonDto
> {
  constructor(private readonly service: PeopleService) {
    super(service)
  }

  override remove(): Promise<Person> {
    throw new ForbiddenException('Eliminar clientes no está permitido')
  }
}
