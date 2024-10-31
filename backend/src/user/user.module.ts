import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PaymentService } from './service/payment/payment.service';
import { UserService } from './service/user/user.service';
import { UserController } from './controller/user/user.controller';
import { PaymentController } from './controller/payment/payment.controller';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [UserService, PaymentService],
  exports: [UserService, PaymentService],
  controllers: [UserController, PaymentController],
})
export class UserModule {}
