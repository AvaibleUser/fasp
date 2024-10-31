import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { PaymentService } from 'src/user/service/payment/payment.service';

@Controller('api/users/:userId/payments')
export class PaymentController {
  constructor(private accountService: PaymentService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAccount(@Param('userId') userId: number) {
    return this.accountService.findAll(userId);
  }
}
