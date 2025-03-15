import { Prisma } from '@prisma/client'
import { IsBoolean, IsOptional, IsPositive, IsString } from 'class-validator'
import { EntityExists } from 'src/common/validators/entity-exists.validator'

export class CreateProductDto
  implements Omit<Prisma.ProductCreateManyInput, 'id'>
{
  @IsOptional()
  @IsString({ message: 'barcode must be a string' })
  barcode?: string

  @IsString({ message: 'name must be a string' })
  name: string

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string

  @IsPositive({ message: 'retailPrice must be a positive number' })
  retailPrice: number

  @IsPositive({ message: 'wholesalePrice must be a positive number' })
  wholesalePrice: number

  @IsPositive({ message: 'wholesaleQty must be a positive number' })
  wholesaleQty: number

  @IsPositive({ message: 'minStock must be a positive number' })
  minStock: number

  @IsOptional()
  @IsString({ message: 'image must be a string' })
  image?: string

  @IsOptional()
  @IsBoolean({ message: 'active must be a boolean' })
  active?: boolean

  @IsPositive({ message: 'categoryId must be a positive number' })
  @EntityExists('category')
  categoryId: number
}
