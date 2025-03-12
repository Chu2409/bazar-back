import { IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

export class SalesFiltersDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  sort?: 'id' | 'name' | 'price'

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc'
}
