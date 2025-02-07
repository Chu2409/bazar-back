import { Module } from '@nestjs/common'
import { IdentificationsService } from './identifications.service'
import { IdentificationsController } from './identifications.controller'

@Module({
  controllers: [IdentificationsController],
  providers: [IdentificationsService],
})
export class IdentificationsModule {}
