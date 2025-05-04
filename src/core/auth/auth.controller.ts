import { Body, Controller, Get, HttpCode, Post, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/req/sign-in.dto'
import { Auth } from 'src/core/auth/decorators/auth.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto)
  }

  @Get('me')
  @Auth()
  getMe(@Request() req) {
    const user = req.user
    return user
  }
}
