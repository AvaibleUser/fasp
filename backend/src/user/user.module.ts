import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AccountService } from './service/account/account.service';
import { UserService } from './service/user/user.service';
import { UserController } from './controller/user/user.controller';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [UserService, AccountService],
  exports: [UserService, AccountService],
  controllers: [UserController],
})
export class UserModule {}
