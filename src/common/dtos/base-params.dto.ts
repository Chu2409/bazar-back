import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class BaseParamsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10

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
  @IsInt()
  status?: number
}
