import { Prisma } from '@prisma/client'

export const categories: Prisma.CategoryCreateManyInput[] = [
  {
    name: 'Category 1',
  },
  {
    name: 'Category 2',
  },
  {
    name: 'Category 3',
  },
]
