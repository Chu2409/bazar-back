import { Prisma } from '@prisma/client'
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'
import { EntityExists } from 'src/common/validators/entity-exists.validator'

export class CreateCustomerDto
  implements Omit<Prisma.CustomerCreateManyInput, 'id'>
{
  @IsOptional()
  @IsString({ message: 'address must be a string' })
  address?: string

  @IsInt({ message: 'personId must be a number' })
  @EntityExists('person')
  personId: number

  @IsOptional()
  @IsBoolean({ message: 'active must be a boolean' })
  active?: boolean
}
