import { Prisma } from '@prisma/client'

export const sales: Prisma.SaleCreateManyInput[] = [
  {
    total: 100,
    discount: 0,
    subTotal: 100,
    customerId: 1,
  },
  {
    total: 100,
    discount: 0,
    subTotal: 100,
    customerId: 2,
  },
]
