import { HttpStatus, Injectable } from '@nestjs/common'
import { SignInDto } from './dto/req/sign-in.dto'
import { JwtService } from '@nestjs/jwt'
import { IJwtPayload } from './types/jwt-payload.interface'
import { DisplayableException } from 'src/common/exceptions/displayable.exception'
import { comparePassword } from 'src/common/utils/encrypter'
import { PrismaService } from 'src/global/prisma/prisma.service'
import { SignInResDto } from './dto/res/sign-in-res.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn({ username, password }: SignInDto): Promise<SignInResDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
        active: true,
      },
    })

    if (!user)
      throw new DisplayableException(
        'Usuario activo no encontrado',
        HttpStatus.NOT_FOUND,
      )

    const isPasswordValid = comparePassword(password, user.password)

    if (!isPasswordValid)
      throw new DisplayableException(
        'Creedenciales incorrectas',
        HttpStatus.BAD_REQUEST,
      )

    return {
      token: this.createToken({ id: user.id }),
    }
  }

  private createToken = (payload: IJwtPayload) => {
    return this.jwtService.sign(payload)
  }
}
