import { Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { people } from './data/people'
import { users } from './data/user'
import { identifications } from './data/identifications'
import { customers } from './data/customers'
import { products } from './data/products'
import { categories } from './data/categories'
import { suppliers } from './data/suppliers'
import { lots } from './data/lots'
import { sales } from './data/sales'
import { items } from './data/items'

const prisma = new PrismaClient()

const main = async () => {
  await prisma.person.createMany({
    data: people,
  })

  await prisma.identification.createMany({
    data: identifications,
  })

  await prisma.user.createMany({
    data: users,
  })

  await prisma.customer.createMany({
    data: customers,
  })

  await prisma.category.createMany({
    data: categories,
  })

  await prisma.product.createMany({
    data: products,
  })

  await prisma.supplier.createMany({
    data: suppliers,
  })

  await prisma.lot.createMany({
    data: lots,
  })

  await prisma.sale.createMany({
    data: sales,
  })

  await prisma.item.createMany({
    data: items,
  })

  Logger.log('Seed data created successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    Logger.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
