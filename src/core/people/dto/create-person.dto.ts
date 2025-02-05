import { Prisma } from '@prisma/client'
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator'
import { IsUnique } from 'src/common/validators/unique.validator'

export class CreatePersonDto
  implements Omit<Prisma.PersonCreateManyInput, 'id'>
{
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsUnique('person', 'email')
  email: string

  @IsString({ message: 'name must be a string' })
  firstName: string

  @IsString({ message: 'secondName must be a string' })
  @IsOptional()
  secondName?: string

  @IsString({ message: 'firstSurname must be a string' })
  firstSurname: string

  @IsString({ message: 'secondSurname must be a string' })
  @IsOptional()
  secondSurname?: string

  @IsArray({ message: 'phoneNumbers must be an array' })
  @ArrayNotEmpty({ message: 'phoneNumbers must not be empty' })
  @IsString({ each: true, message: 'phoneNumbers must be an array of strings' })
  phoneNumbers: string[]
}
