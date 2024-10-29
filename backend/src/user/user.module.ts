import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AccountService } from './service/account/account.service';
import { UserService } from './service/user/user.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [UserService, AccountService],
  exports: [UserService, AccountService],
})
export class UserModule {}
