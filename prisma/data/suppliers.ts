import { Prisma } from '@prisma/client'

export const suppliers: Prisma.SupplierCreateManyInput[] = [
  {
    name: 'Supplier 1',
    address: 'Calle Imabura y 6 de Diciembre',
  },
  {
    name: 'Supplier 2',
    address: 'Av. 12 de Octubre y Cordero',
  },
]
