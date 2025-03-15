import { PartialType } from '@nestjs/mapped-types'
import { CreateIdentificationDto } from './create.dto'
import { IsInt } from 'class-validator'

export class UpdateIdentificationDto extends PartialType(
  CreateIdentificationDto,
) {
  @IsInt({ message: 'id must be an integer' })
  id: number
}
