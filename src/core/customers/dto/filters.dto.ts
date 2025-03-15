import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { BaseParamsDto } from 'src/common/dtos/base-params.dto'

export class CustomersFiltersDto extends BaseParamsDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  sort?: 'id' | 'name' | 'price'

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc'

  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  status?: number | number[]
}
