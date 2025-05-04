import { Prisma } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class CreateUserDto implements Omit<Prisma.UserCreateManyInput, 'id'> {
  @IsString({ message: 'username must be a string' })
  // @IsUnique('user', 'username')
  username: string

  @IsString({ message: 'password must be a string' })
  password: string

  @IsBoolean({ message: 'active must be a boolean' })
  @IsOptional()
  @Type(() => Boolean)
  active?: boolean

  @IsInt({ message: 'personId must be a number' })
  // @EntityExists('person')
  personId: number
}
