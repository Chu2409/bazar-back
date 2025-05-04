import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
  @IsString({ message: 'name must be a string' })
  name: string

  @IsOptional()
  @IsBoolean({ message: 'active must be a boolean' })
  active?: boolean
}
