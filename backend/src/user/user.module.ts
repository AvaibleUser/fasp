import { Module } from '@nestjs/common';
import { UserService } from './service/user/user.service';
import { AccountService } from './service/account/account.service';

@Module({
  providers: [UserService, AccountService],
  exports: [UserService],
})
export class UserModule {}
