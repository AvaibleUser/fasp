import { Injectable } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { AccountCreateDto } from 'src/user/data/dto/account.dto';
import { FinanceCreateDto } from 'src/user/data/dto/finance.dto';
import { UserCreateDto } from 'src/user/data/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(
    data: UserCreateDto,
    account: AccountCreateDto,
    finanza: FinanceCreateDto,
  ): Promise<Usuario> {
    return this.prismaService.cuenta
      .create({
        data: {
          ...account,
          finanza: { create: finanza },
          usuario: { create: { ...data } },
        },
        select: {
          usuario: true,
        },
      })
      .usuario();
  }

  async findOne(username: string): Promise<Usuario | undefined> {
    return this.prismaService.usuario.findFirst({
      where: { estado: 'ACTIVO', OR: [{ username }, { email: username }] },
    });
  }

  async deleteOne(username: string): Promise<void> {
    const user = await this.prismaService.usuario.findFirst({
      where: { OR: [{ username }, { email: username }] },
    });
    if (user) {
      const accounts = await this.prismaService.cuenta.findMany({
        where: { usuarioId: user.id },
      });
      if (accounts.length !== 0) {
        accounts.some((account) => {
          if (account.saldo > 0) {
            return true;
          }
        });
      }

      await this.prismaService.usuario.updateMany({
        where: { OR: [{ username }, { email: username }] },
        data: { estado: 'INACTIVO' },
      });
    }
  }
}
