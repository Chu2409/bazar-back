import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

export class ProductsFiltersDto extends BaseParamsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number
}
