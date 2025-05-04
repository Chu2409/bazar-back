import { Module } from '@nestjs/common'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { AuthModule } from './core/auth/auth.module'
import { UsersModule } from './core/users/users.module'
import { CustomConfigModule } from './global/config/config.module'
import { PrismaModule } from './global/prisma/prisma.module'
import { CustomersModule } from './core/customers/customers.module'
import { CategoriesModule } from './core/categories/categories.module'
import { ProductsModule } from './core/products/products.module'
import { SuppliersModule } from './core/suppliers/suppliers.module'
import { SalesModule } from './core/sales/sales.module'
import { InventoryModule } from './core/inventory/inventory.module'
@Module({
  imports: [
    CustomConfigModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    CustomersModule,
    CategoriesModule,
    ProductsModule,
    SuppliersModule,
    SalesModule,
    InventoryModule,
  ],
  providers: [ResponseInterceptor],
})
export class AppModule {}
