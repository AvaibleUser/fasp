import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { TransactionService } from './service/transaction/transaction.service';
import { TransactionController } from './component/transaction/transaction.controller';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
