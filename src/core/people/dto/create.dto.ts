import { Prisma } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { CreateIdentificationDto } from 'src/core/identifications/dto/create.dto'

export class CreatePersonDto
  implements Omit<Prisma.PersonCreateManyInput, 'id'>
{
  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address' })
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
  @IsString({ each: true, message: 'phoneNumbers must be an array of strings' })
  phoneNumbers: string[]

  @IsArray({ message: 'identifications must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateIdentificationDto)
  @ArrayMinSize(1, { message: 'At least one identification is required' })
  identifications: CreateIdentificationDto[]
}
