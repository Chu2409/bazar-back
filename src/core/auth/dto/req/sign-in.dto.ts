import { IsString, Length } from 'class-validator'

export class SignInDto {
  @IsString({ message: 'username must be a string' })
  @Length(6, 20, { message: 'username must be between 4 and 20 characters' })
  username: string

  @IsString({ message: 'password must be a string' })
  @Length(6, 20, { message: 'password must be between 4 and 20 characters' })
  password: string
}
