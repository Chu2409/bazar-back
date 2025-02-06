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
import { CustomersModule } from './core/customers/customers.module'
import { CategoriesModule } from './core/categories/categories.module'
import { ProductsModule } from './core/products/products.module'
import { SuppliersModule } from './core/suppliers/suppliers.module'
import { SalesModule } from './core/sales/sales.module'
import { LotsModule } from './core/lots/lots.module'
import { ItemsModule } from './core/items/items.module'
@Module({
  imports: [
    PeopleModule,
    UsersModule,
    AuthModule,
    CustomConfigModule,
    PrismaModule,
    CustomersModule,
    CategoriesModule,
    ProductsModule,
    SuppliersModule,
    SalesModule,
    LotsModule,
    ItemsModule,
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
