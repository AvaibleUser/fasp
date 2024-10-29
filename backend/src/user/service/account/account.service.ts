import { Injectable } from '@nestjs/common';
import { EstadoCuenta, TipoFinanza } from '@prisma/client';
import { webServices } from 'src/data/constant/web-services.constant';
import { AccountCreateDto } from 'src/user/data/dto/account.dto';

@Injectable()
export class AccountService {
  async findAccountToken(
    accountNumber: number,
    username: string,
    type: 'credit' | 'bank',
  ) {
    const service = type === 'credit' ? webServices.credit : webServices.bank;
    if (!service.url) {
      throw new Error('El servicio esta en mantenimiento');
    }
    const body = {
      ...service.endpoints.link.body,
      account_number: accountNumber,
      numeroTarjeta: accountNumber,
      nombreUsuario: username,
    };

    const response = await fetch(service.url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });

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
