import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiMessage } from './common/decorators/api-message.decorator'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiMessage(['Probando'], true)
  getHello(): string {
    return 'Hello World!'
  }
}
