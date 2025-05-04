import { IdentificationType } from '@prisma/client'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

export class CreateIdentificationDto {
  @IsEnum(IdentificationType)
  type: IdentificationType

  @IsString({ message: 'value must be a string' })
  value: string

  @IsOptional()
  @IsBoolean({ message: 'active must be a boolean' })
  active?: boolean
}
