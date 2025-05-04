import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { CreatePersonDto } from 'src/core/people/dto/req/create-person.dto'

export class CreateCustomerDto {
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
