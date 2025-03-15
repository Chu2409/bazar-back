import { IdentificationType, Prisma } from '@prisma/client'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

export class CreateIdentificationDto
  implements Omit<Prisma.IdentificationCreateManyInput, 'id' | 'personId'>
{
  @IsEnum(IdentificationType)
  type: IdentificationType

  @IsString({ message: 'value must be a string' })
  value: string

  @IsOptional()
  @IsBoolean({ message: 'active must be a boolean' })
  active?: boolean
}
