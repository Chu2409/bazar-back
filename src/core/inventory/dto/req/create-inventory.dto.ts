import { IsOptional, IsPositive } from 'class-validator'
// import { EntityExists } from 'src/common/validators/entity-exists.validator'

export class CreateInventoryDto {
  @IsPositive({ message: 'purchasedQty must be a positive number' })
  purchasedQty: number

  @IsPositive({ message: 'stock must be a positive number' })
  @IsOptional()
  stock?: number

  @IsPositive({ message: 'unitCost must be a positive number' })
  unitCost: number

  @IsPositive({ message: 'totalCost must be a positive number' })
  totalCost: number

  @IsPositive({ message: 'productId must be a positive number' })
  // @EntityExists('product')
  productId: number

  @IsPositive({ message: 'supplierId must be a positive number' })
  // @EntityExists('supplier')
  supplierId: number
}
