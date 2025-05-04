import { CustomerResDto } from 'src/core/customers/dto/res/customer-res.dto'
import { ItemResDto } from 'src/core/items/dto/res/item-res.dto'

export interface SaleResDto {
  id: number
  dateTime: Date
  subTotal: number
  discount: number
  total: number
  customer: CustomerResDto
  items: ItemResDto[]
}
