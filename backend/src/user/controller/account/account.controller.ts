import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { AccountService } from 'src/user/service/account/account.service';

@Controller('api/users/:userId/accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAccount(@Param('userId') userId: number) {
    return this.accountService.findAll(userId);
  }
}
