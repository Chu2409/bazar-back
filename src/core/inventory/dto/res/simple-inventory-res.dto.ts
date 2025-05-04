import { SimpleProductResDto } from 'src/core/products/dto/res/simple-product-res.dto'

export interface SimpleInventoryResDto {
  id: number
  purchasedQty: number
  stock: number
  unitCost: number
  totalCost: number
  product: SimpleProductResDto
}
