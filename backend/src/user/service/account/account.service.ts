import { Injectable } from '@nestjs/common';
import { EstadoCuenta, TipoFinanza } from '@prisma/client';
import { webServices } from 'src/data/constant/web-services.constant';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { AccountCreateDto } from 'src/user/data/dto/account.dto';

@Injectable()
export class AccountService {
  constructor(private prismaService: PrismaService) {}

  async findAll(userId: number) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId, estado: 'ACTIVO' },
      include: { cuentas: true },
    });

    return user?.cuentas;
  }

  async findToken(
    accountNumber: number,
    username: string,
    type: 'credit' | 'bank',
  ) {
    const service = type === 'credit' ? webServices.credit : webServices.bank;
    if (!service.host) {
      throw new Error('El servicio esta en mantenimiento');
    }
    const body = {
      ...service.endpoints.link.body,
      account_number: accountNumber,
      numeroTarjeta: accountNumber,
      nombreUsuario: username,
    };

    const response = await fetch(
      `${service.host}/${service.endpoints.link.uri}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error ?? 'No se encontro la cuenta');
    }

    const account: AccountCreateDto = {
      estado: EstadoCuenta.ACTIVA,
      nombre: accountNumber.toString(),
      tipo: type === 'credit' ? TipoFinanza.CREDITO : TipoFinanza.BANCO,
    };

    return { token: result.token, account };
  }
}
