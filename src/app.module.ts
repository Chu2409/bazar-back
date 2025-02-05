import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { EntityExistsConstraint } from './common/validators/entity-exists.validator'
import { IsUniqueConstraint } from './common/validators/unique.validator'
import { AuthModule } from './core/auth/auth.module'
import { PeopleModule } from './core/people/people.module'
import { UsersModule } from './core/users/users.module'
import { CustomConfigService } from './global/config/config.service'
import { PrismaService } from './global/prisma/prisma.service'
import { CustomConfigModule } from './global/config/config.module'
import { PrismaModule } from './global/prisma/prisma.module'
@Module({
  imports: [
    PeopleModule,
    UsersModule,
    AuthModule,
    CustomConfigModule,
    PrismaModule,
  ],
  providers: [
    AppService,
    ResponseInterceptor,
    IsUniqueConstraint,
    EntityExistsConstraint,
    PrismaService,
    CustomConfigService,
  ],
  controllers: [AppController],
})
export class AppModule {}
