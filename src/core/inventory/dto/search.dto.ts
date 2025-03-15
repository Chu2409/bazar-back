import { IsOptional, IsString } from 'class-validator'

export class InventorySearchDto {
  @IsOptional()
  @IsString()
  search?: string
}
