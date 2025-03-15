import { Prisma } from '@prisma/client'

export const items: Prisma.ItemCreateManyInput[] = [
  {
    inventoryId: 1,
    saleId: 1,
    qty: 10,
    unitPrice: 10,
  },
  {
    inventoryId: 2,
    saleId: 1,
    qty: 20,
    unitPrice: 20,
  },
  {
    inventoryId: 3,
    saleId: 1,
    qty: 30,
    unitPrice: 30,
  },
  {
    inventoryId: 1,
    saleId: 2,
    qty: 10,
    unitPrice: 10,
  },
  {
    inventoryId: 2,
    saleId: 2,
    qty: 20,
    unitPrice: 20,
  },
  {
    inventoryId: 3,
    saleId: 2,
    qty: 30,
    unitPrice: 30,
  },
]
