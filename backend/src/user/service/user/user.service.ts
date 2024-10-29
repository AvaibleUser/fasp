import { Injectable } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { AccountCreateDto } from 'src/user/data/dto/account.dto';
import { UserCreateDto } from 'src/user/data/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(
    data: UserCreateDto,
    account: AccountCreateDto,
  ): Promise<Usuario> {
    return this.prismaService.usuario.create({
      data: {
        ...data,
        cuentas: { create: { ...account } },
      },
    });
  }

  async findOne(username: string): Promise<Usuario | undefined> {
    return this.prismaService.usuario.findFirst({
      where: { estado: 'ACTIVO', OR: [{ username }, { email: username }] },
    });
  }

  async deleteOne(id: number): Promise<void> {
    const user = await this.prismaService.usuario.findUnique({
      where: { id, estado: 'ACTIVO' },
    });

    if (user) {
      if (!user.saldo) {
        throw new Error('No se puede eliminar un usuario con saldo');
      }

      await this.prismaService.usuario.update({
        where: { id },
        data: { estado: 'INACTIVO' },
      });
    }
  }
}
