import { Injectable } from '@nestjs/common'
import { CreateLotDto } from './dto/create-lot.dto'
import { UpdateLotDto } from './dto/update-lot.dto'
import { BaseService } from 'src/common/services/base.service'
import { Lot } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'

@Injectable()
export class LotsService extends BaseService<Lot, CreateLotDto, UpdateLotDto> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'lot')
  }
}
