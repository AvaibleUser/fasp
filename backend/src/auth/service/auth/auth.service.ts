import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { hashConfig } from 'src/auth/data/constant/hash.constant';
import { SignInRes } from 'src/auth/data/dto/sign-in.dto';
import { SignUpReq, SignUpRes } from 'src/auth/data/dto/sign-up.dto';
import { UserRole } from 'src/user/data/enum/user-role.enum';
import { UserState } from 'src/user/data/enum/user-type.enum';
import { UserService } from 'src/user/service/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<SignInRes> {
    const user = await this.usersService.findOne(username);

    if (compare(pass, user.password)) {
      throw new UnauthorizedException();
    }
    return {
      ...(await this.generateToken(user.id, user.username, user.email)),
    };
  }

  async signUp(data: SignUpReq): Promise<SignUpRes> {
    const user = await this.usersService.create({
      ...data,
      estado: UserState.ACTIVO,
      rol: UserRole.USER,
      password: await hash(data.password, hashConfig.salt),
      email: `${data.username}4@fasp.com`,
    });

    return {
      ...user,
      ...(await this.generateToken(user.id, user.email, user.username)),
    };
  }

  private async generateToken(id: number, email: string, username: string) {
    const payload = { sub: id, email, username };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
