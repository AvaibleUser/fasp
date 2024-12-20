import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
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

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  accountNumber: number;

  @IsNotEmpty()
  @IsString()
  type: 'credit' | 'bank';
}

export type SignUpRes = UserDto & SignInRes;
