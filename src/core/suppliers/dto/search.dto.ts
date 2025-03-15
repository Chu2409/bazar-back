import { IsOptional, IsString } from 'class-validator'

export class SuppliersSearchDto {
  @IsOptional()
  @IsString()
  search?: string
}
