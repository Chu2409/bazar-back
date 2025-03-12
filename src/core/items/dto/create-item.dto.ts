import { Prisma } from '@prisma/client'
import { IsPositive } from 'class-validator'
import { EntityExists } from 'src/common/validators/entity-exists.validator'

export class CreateItemDto
  implements Omit<Prisma.ItemCreateManyInput, 'id' | 'saleId'>
{
  @IsPositive({ message: 'qty must be a positive number' })
  qty: number

  @IsPositive({ message: 'unitPrice must be a positive number' })
  unitPrice: number

  @IsPositive({ message: 'lotId must be a positive number' })
  @EntityExists('lot')
  lotId: number
}
