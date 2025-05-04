import { IdentificationResDto } from 'src/core/identifications/dto/res/identification-res.dto'

export interface PersonResDto {
  id: number
  email: string
  firstName: string
  secondName: string | null
  firstSurname: string
  secondSurname: string | null
  phoneNumbers: string[]
  identifications: IdentificationResDto[]
}
