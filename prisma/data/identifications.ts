import { IdentificationType, Prisma } from '@prisma/client'

export const identifications: Prisma.IdentificationCreateManyInput[] = [
  {
    type: IdentificationType.DNI,
    value: '0707047643',
    personId: 1,
  },
  {
    type: IdentificationType.RUC,
    value: '0707047643001',
    personId: 1,
  },
  {
    type: IdentificationType.DNI,
    value: '1812343312',
    personId: 2,
  },
  {
    type: IdentificationType.RUC,
    value: '1812343312001',
    personId: 2,
  },
]
