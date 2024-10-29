import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EstadoUsuario, RolUsuario } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { hashConfig } from 'src/auth/data/constant/hash.constant';
import { SignInRes } from 'src/auth/data/dto/sign-in.dto';
import { SignUpReq, SignUpRes } from 'src/auth/data/dto/sign-up.dto';
import { AccountService } from 'src/user/service/account/account.service';
import { UserService } from 'src/user/service/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signIn(username: string, pass: string): Promise<SignInRes> {
    const user = await this.userService.findOne(username);

    if (compare(pass, user.password)) {
      throw new UnauthorizedException('La contraseña es incorrecta');
    }
    return {
      ...(await this.generateToken(user.id, user.rol)),
    };
  }

  async signUp(signUp: SignUpReq): Promise<SignUpRes> {
    if (this.userService.findOne(signUp.username)) {
      throw new ConflictException('El nombre de usuario ya existe');
    }
    const { token, account } = await this.accountService.findToken(
      signUp.accountNumber,
      signUp.username,
      signUp.type,
    );

    const userData = {
      ...signUp,
      accountNumber: undefined,
      type: undefined,
      estado: EstadoUsuario.ACTIVO,
      rol: RolUsuario.USER,
      password: await hash(signUp.password, hashConfig.salt),
      email: `${signUp.username}4@fasp.com`,
      saldo: 0,
    };

    const user = await this.userService.create(userData, account);

    this.cacheManager.set(
      `user_${user.id}_${signUp.accountNumber}`,
      token || signUp.accountNumber,
    );

    return {
      ...user,
      ...(await this.generateToken(user.id, user.rol)),
    };
  }

  private async generateToken(id: number, role: RolUsuario) {
    const payload = { sub: id, role };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
