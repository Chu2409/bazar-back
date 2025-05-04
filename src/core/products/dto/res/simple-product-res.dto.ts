export interface SimpleProductResDto {
  id: number
  barcode: string | null
  name: string
  description: string | null
  retailPrice: number
  wholesalePrice: number
  wholesaleQty: number
  minStock: number
  image: string | null
  active: boolean
}
