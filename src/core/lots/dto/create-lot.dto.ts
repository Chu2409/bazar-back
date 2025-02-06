import { Prisma } from '@prisma/client'
import { IsPositive } from 'class-validator'
import { EntityExists } from 'src/common/validators/entity-exists.validator'

export class CreateLotDto implements Omit<Prisma.LotCreateManyInput, 'id'> {
  @IsPositive({ message: 'La cantidad comprada debe ser un número positivo' })
  purchasedQty: number

  @IsPositive({ message: 'La cantidad en stock debe ser un número positivo' })
  stock: number

  @IsPositive({ message: 'El costo unitario debe ser un número positivo' })
  unitCost: number

  @IsPositive({ message: 'El costo total debe ser un número positivo' })
  totalCost: number

  @IsPositive({ message: 'El id del producto debe ser un número positivo' })
  productId: number

  @IsPositive({ message: 'El id del proveedor debe ser un número positivo' })
  @EntityExists('supplier')
  supplierId: number
}
