import { Prisma } from '@prisma/client'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { IsUnique } from 'src/common/validators/unique.validator'

export class CreateCategoryDto
  implements Omit<Prisma.CategoryCreateManyInput, 'id'>
{
  @IsString({ message: 'name must be a string' })
  @IsUnique('category', 'name')
  name: string

  @IsOptional()
  @IsBoolean({ message: 'active must be a boolean' })
  active?: boolean
}
