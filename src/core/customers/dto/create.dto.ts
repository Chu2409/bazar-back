import { Prisma } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { CreatePersonDto } from 'src/core/people/dto/create.dto'

export class CreateCustomerDto
  implements Omit<Prisma.CustomerCreateManyInput, 'id' | 'personId'>
{
  @IsOptional()
  @IsString({ message: 'address must be a string' })
  address?: string

  @ValidateNested()
  @Type(() => CreatePersonDto)
  @IsNotEmpty({ message: 'person must not be empty' })
  person: CreatePersonDto

  @IsOptional()
  @IsBoolean({ message: 'active must be a boolean' })
  active?: boolean
}
