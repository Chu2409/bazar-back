import { Prisma } from '@prisma/client'

export const lots: Prisma.LotCreateManyInput[] = [
  {
    purchasedQty: 100,
    stock: 100,
    productId: 1,
    supplierId: 1,
    totalCost: 100,
    unitCost: 1,
  },
  {
    purchasedQty: 200,
    stock: 200,
    productId: 2,
    supplierId: 2,
    totalCost: 200,
    unitCost: 1,
  },
  {
    purchasedQty: 300,
    stock: 300,
    productId: 3,
    supplierId: 1,
    totalCost: 300,
    unitCost: 1,
  },
]
