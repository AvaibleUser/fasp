import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from 'src/user/service/user/user.service';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteOne(id);
  }
}
