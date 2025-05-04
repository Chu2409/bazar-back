import { ProductResDto } from 'src/core/products/dto/res/product-res.dto'
import { SupplierResDto } from 'src/core/suppliers/dto/res/supplier-res.dto'

export interface InventoryResDto {
  id: number
  purchasedQty: number
  stock: number
  unitCost: number
  totalCost: number
  product: ProductResDto
  supplier: SupplierResDto
}
