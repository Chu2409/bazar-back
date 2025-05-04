import { PersonResDto } from 'src/core/people/dto/res/person-res.dto'

export interface CustomerResDto {
  id: number
  address: string | null
  active: boolean
  person: PersonResDto
}
