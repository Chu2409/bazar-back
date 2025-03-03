import { PartialType } from '@nestjs/mapped-types'
import {
  CreateIdentificationDto,
  CreateIdentificationWithoutPersonIdDto,
} from './create-identification.dto'
import { IsInt } from 'class-validator'

export class UpdateIdentificationDto extends PartialType(
  CreateIdentificationDto,
) {}

export class UpdateIdentificationWithoutPersonIdDto extends PartialType(
  CreateIdentificationWithoutPersonIdDto,
) {
  @IsInt({ message: 'id must be an integer' })
  id: number
}
