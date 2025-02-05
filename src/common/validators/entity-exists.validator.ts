/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { PrismaService } from 'src/global/prisma/prisma.service'

@ValidatorConstraint({ async: true })
@Injectable()
export class EntityExistsConstraint implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(value: unknown, args: any): Promise<boolean> {
    if (!value) return true // Skip validation if no value

    const { model, field = 'id' } = args.constraints[0]

    try {
      // @ts-expect-error - model is a string
      const entity = await this.prisma[model].findUnique({
        where: { [field]: value },
      })

      if (!entity) throw new BadRequestException(this.defaultMessage(args))

      return !!entity
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false
    }
  }

  defaultMessage(args?: any): string {
    const { model, field = 'id' } = args.constraints[0]
    return `${model} with ${field} ${args.value} does not exist`
  }
}

export function EntityExists(
  model: keyof PrismaClient,
  field: string = 'id',
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [{ model, field }],
      validator: EntityExistsConstraint,
    })
  }
}
