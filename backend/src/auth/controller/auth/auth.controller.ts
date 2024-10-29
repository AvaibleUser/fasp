import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInReq } from 'src/auth/data/dto/sign-in.dto';
import { SignUpReq } from 'src/auth/data/dto/sign-up.dto';
import { Public } from 'src/auth/decorator/public/public.decorator';
import { AuthService } from 'src/auth/service/auth/auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInReq) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.OK)
  signUp(@Body() signUpDto: SignUpReq) {
    return this.authService.signUp(signUpDto);
  }
}
