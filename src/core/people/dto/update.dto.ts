import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreatePersonDto } from './create.dto'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { UpdateIdentificationDto } from 'src/core/identifications/dto/update.dto'
import { Type } from 'class-transformer'

export class UpdatePersonDto extends PartialType(
  OmitType(CreatePersonDto, ['identifications'] as const),
) {
  @IsArray({ message: 'identifications must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateIdentificationDto)
  @IsOptional()
  identifications?: UpdateIdentificationDto[]
}
