import { PartialType } from '@nestjs/mapped-types'
import { CreateIdentificationDto } from './create-identification.dto'

export class UpdateIdentificationDto extends PartialType(
  CreateIdentificationDto,
) {}
