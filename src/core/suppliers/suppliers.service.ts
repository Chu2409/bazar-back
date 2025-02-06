import { Injectable } from '@nestjs/common'
import { CreateSupplierDto } from './dto/create-supplier.dto'
import { UpdateSupplierDto } from './dto/update-supplier.dto'
import { BaseService } from 'src/common/services/base.service'
import { Supplier } from '@prisma/client'
import { PrismaService } from 'src/global/prisma/prisma.service'

@Injectable()
export class SuppliersService extends BaseService<
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto
> {
  constructor(prismaService: PrismaService) {
    super(prismaService, 'supplier')
  }
}
