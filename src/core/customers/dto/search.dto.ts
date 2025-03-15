import { IsOptional, IsString } from 'class-validator'

export class CustomersSearchDto {
  @IsOptional()
  @IsString()
  search?: string
}
