import { Injectable } from '@nestjs/common';
import { webServices } from 'src/data/constant/web-services.constant';
import { AccountCreateDto } from 'src/user/data/dto/account.dto';
import { FinanceCreateDto } from 'src/user/data/dto/finance.dto';
import { AccountStatus } from 'src/user/data/enum/account.enum';
import { FinanceType } from 'src/user/data/enum/finance.enum';

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
      saldo: 0,
      estado: AccountStatus.ACTIVA,
    };
    const finance: FinanceCreateDto = {
      nombre: accountNumber.toString(),
      tipo: type === 'credit' ? FinanceType.CREDITO : FinanceType.BANCO,
    };

    return { token: result.token, account, finance };
  }
}