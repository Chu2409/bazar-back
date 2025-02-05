import { Prisma } from '@prisma/client'

export const people: Prisma.PersonCreateManyInput[] = [
  {
    firstName: 'Daniel',
    firstSurname: 'Zhu',
    email: 'dzhu2409@gmail.com',
    phoneNumbers: ['0967229875', '0999999999'],
  },
  {
    firstName: 'Juan',
    firstSurname: 'Perez',
    email: 'juanperez@mail.com',
    phoneNumbers: ['0999999999'],
  },
  {
    firstName: 'Maria',
    firstSurname: 'Gonzalez',
    email: 'maria@mail.com',
    phoneNumbers: ['0999999999'],
  },
]
