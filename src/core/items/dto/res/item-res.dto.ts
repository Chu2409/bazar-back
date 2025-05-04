import { SimpleInventoryResDto } from 'src/core/inventory/dto/res/simple-inventory-res.dto'

export interface ItemResDto {
  id: number
  qty: number
  unitPrice: number
  inventory: SimpleInventoryResDto
}
