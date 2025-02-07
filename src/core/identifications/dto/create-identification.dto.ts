import { IdentificationType, Prisma } from '@prisma/client'
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator'
import { EntityExists } from 'src/common/validators/entity-exists.validator'

export class CreateIdentificationDto
  implements Omit<Prisma.IdentificationCreateManyInput, 'id'>
{
  @IsEnum(IdentificationType)
  type: IdentificationType

  @IsString({ message: 'value must be a string' })
  value: string

  @IsOptional()
  @IsBoolean({ message: 'active must be a boolean' })
  active?: boolean

  @IsPositive({ message: 'personId must be a positive number' })
  @EntityExists('person')
  personId: number
}
