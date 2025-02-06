import { Injectable } from '@nestjs/common'
import { CreateSaleDto } from './dto/create-sale.dto'
import { UpdateSaleDto } from './dto/update-sale.dto'
import { BaseService } from 'src/common/services/base.service'
import { Sale } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'

@Injectable()
export class SalesService extends BaseService<
  Sale,
  CreateSaleDto,
  UpdateSaleDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'sale')
  }
}
