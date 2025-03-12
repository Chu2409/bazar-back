import { Prisma } from '@prisma/client'

export const items: Prisma.ItemCreateManyInput[] = [
  {
    lotId: 1,
    saleId: 1,
    qty: 10,
    unitPrice: 10,
  },
  {
    lotId: 2,
    saleId: 1,
    qty: 20,
    unitPrice: 20,
  },
  {
    lotId: 3,
    saleId: 1,
    qty: 30,
    unitPrice: 30,
  },
  {
    lotId: 1,
    saleId: 2,
    qty: 10,
    unitPrice: 10,
  },
  {
    lotId: 2,
    saleId: 2,
    qty: 20,
    unitPrice: 20,
  },
  {
    lotId: 3,
    saleId: 2,
    qty: 30,
    unitPrice: 30,
  },
]
