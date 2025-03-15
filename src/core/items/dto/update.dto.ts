import { PartialType } from '@nestjs/mapped-types'
import { CreateItemDto } from './create.dto'
import { IsInt } from 'class-validator'

export class UpdateItemWithoutSaleIdDto extends PartialType(CreateItemDto) {
  @IsInt({ message: 'id must be an integer' })
  id: number
}
