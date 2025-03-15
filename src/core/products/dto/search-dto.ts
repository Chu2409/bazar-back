import { IsOptional, IsString } from 'class-validator'

export class ProductsSearchDto {
  @IsOptional()
  @IsString()
  search?: string
}
