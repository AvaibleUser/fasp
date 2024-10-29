import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AccountService } from './service/account/account.service';
import { UserService } from './service/user/user.service';
import { UserController } from './controller/user/user.controller';
import { AccountController } from './controller/account/account.controller';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [UserService, AccountService],
  exports: [UserService, AccountService],
  controllers: [UserController, AccountController],
})
export class UserModule {}
