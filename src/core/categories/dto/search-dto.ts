import { IsOptional, IsString } from 'class-validator'

export class CategoriesSearchDto {
  @IsOptional()
  @IsString()
  search?: string
}
