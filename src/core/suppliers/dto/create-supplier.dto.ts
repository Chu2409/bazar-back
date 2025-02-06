import { Prisma } from '@prisma/client'
import {
  IsBoolean,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateSupplierDto
  implements Omit<Prisma.SupplierCreateManyInput, 'id'>
{
  @IsString({ message: 'name must be a string' })
  name: string

  @IsOptional()
  @IsNumberString({}, { message: 'phone must be a number string' })
  phone?: string

  @IsOptional()
  @IsString({ message: 'email must be a string' })
  address?: string

  @IsOptional()
  @IsBoolean({ message: 'active must be a boolean' })
  active?: boolean | undefined
}
