import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInReq {
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export type SignInRes = {
  accessToken: string;
};
