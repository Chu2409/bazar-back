import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateSaleDto } from './create-sale.dto'
import { UpdateItemWithoutSaleIdDto } from 'src/core/items/dto/update-item.dto'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateSaleDto extends PartialType(
  OmitType(CreateSaleDto, ['items'] as const),
) {
  @IsArray({ message: 'identifications must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateItemWithoutSaleIdDto)
  @IsOptional()
  items?: UpdateItemWithoutSaleIdDto[]
}
