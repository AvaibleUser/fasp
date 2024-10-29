import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from 'src/user/service/user/user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':username')
  @HttpCode(HttpStatus.OK)
  getUser(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteOne(id);
  }
}
