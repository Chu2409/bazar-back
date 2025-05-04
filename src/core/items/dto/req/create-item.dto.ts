import { IsPositive } from 'class-validator'

export class CreateItemDto {
  @IsPositive({ message: 'qty must be a positive number' })
  qty: number

  @IsPositive({ message: 'unitPrice must be a positive number' })
  unitPrice: number

  @IsPositive({ message: 'inventoryId must be a positive number' })
  // @EntityExists('inventory')
  inventoryId: number
}
