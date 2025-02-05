import { Prisma } from '@prisma/client'

export const products: Prisma.ProductCreateManyInput[] = [
  {
    name: 'Product 1',
    categoryId: 1,
    retailPrice: 1.2,
    wholesalePrice: 1.1,
    wholesaleQty: 10,
    minStock: 10,
    barcode: '123456789',
  },
  {
    name: 'Product 2',
    categoryId: 2,
    retailPrice: 2.2,
    wholesalePrice: 2.1,
    wholesaleQty: 20,
    minStock: 20,
    barcode: '123456788',
  },
  {
    name: 'Product 3',
    categoryId: 3,
    retailPrice: 3.2,
    wholesalePrice: 3.1,
    wholesaleQty: 30,
    minStock: 30,
    barcode: '123456787',
  },
]
