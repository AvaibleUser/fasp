import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AccountController } from './account/account.controller';
import { TransactionController } from './transaction/transaction.controller';
import { ReportController } from './report/report.controller';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [],
  controllers: [
    AuthController,
    AccountController,
    TransactionController,
    ReportController,
    AdminController,
  ],
  providers: [],
})
export class AppModule {}
