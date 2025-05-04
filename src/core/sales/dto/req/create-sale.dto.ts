import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsPositive,
  ValidateNested,
} from 'class-validator'
import { CreateItemDto } from 'src/core/items/dto/req/create-item.dto'

export class CreateSaleDto {
  @IsPositive({ message: 'subTotal must be a positive number' })
  subTotal: number

  @IsPositive({ message: 'discount must be a positive number' })
  discount: number

  @IsPositive({ message: 'total must be a positive number' })
  total: number

  @IsPositive({ message: 'customerId must be a positive number' })
  // @EntityExists('customer')
  customerId: number

  @IsArray({ message: 'items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  @ArrayMinSize(1, { message: 'At least one item is required' })
  items: CreateItemDto[]
}
