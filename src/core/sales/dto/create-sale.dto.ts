import { Prisma } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsBoolean, IsDate, IsOptional, IsPositive } from 'class-validator'
import { EntityExists } from 'src/common/validators/entity-exists.validator'

export class CreateSaleDto implements Omit<Prisma.SaleCreateManyInput, 'id'> {
  @IsDate({ message: 'dateTime must be a date' })
  @Type(() => Date)
  dateTime: Date

  @IsPositive({ message: 'subTotal must be a positive number' })
  subTotal: number

  @IsPositive({ message: 'discount must be a positive number' })
  discount: number

  @IsPositive({ message: 'total must be a positive number' })
  total: number

  @IsOptional()
  @IsBoolean({ message: 'active must be a boolean' })
  active?: boolean

  @IsOptional()
  @IsPositive({ message: 'customerId must be a positive number' })
  @EntityExists('customer')
  customerId?: number
}
