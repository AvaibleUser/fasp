import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RolUsuario } from '@prisma/client';
import { Request } from 'express';
import { jwtConfig } from 'src/auth/data/constant/jwt.constant';
import { ADMIN } from 'src/auth/decorator/admin/admin.decorator';
import { PUBLIC } from 'src/auth/decorator/public/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConfig.secret,
      });

      const isAdmin = this.reflector.getAllAndOverride<boolean>(ADMIN, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isAdmin && payload.role !== RolUsuario.ADMIN) {
        throw new UnauthorizedException('No tienes permisos para acceder');
      }

      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException(e.message ?? 'Debe iniciar sesión');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
