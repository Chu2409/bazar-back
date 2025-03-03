import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreatePersonDto } from './create-person.dto'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { UpdateIdentificationWithoutPersonIdDto } from 'src/core/identifications/dto/update-identification.dto'
import { Type } from 'class-transformer'

export class UpdatePersonDto extends PartialType(
  OmitType(CreatePersonDto, ['identifications'] as const),
) {
  @IsArray({ message: 'identifications must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateIdentificationWithoutPersonIdDto)
  @IsOptional()
  identifications?: UpdateIdentificationWithoutPersonIdDto[]
}
