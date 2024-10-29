import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from 'src/user/data/dto/user.dto';
import { SignInRes } from './sign-in.dto';

export class SignUpReq {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export type SignUpRes = UserDto & SignInRes;
