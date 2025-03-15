import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateCustomerDto } from './create.dto'
import { Type } from 'class-transformer'
import { ValidateNested, IsOptional } from 'class-validator'
import { UpdatePersonDto } from 'src/core/people/dto/update.dto'

export class UpdateCustomerDto extends OmitType(
  PartialType(CreateCustomerDto),
  ['person'] as const,
) {
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  @IsOptional()
  person?: UpdatePersonDto
}
