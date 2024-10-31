import { Injectable } from '@nestjs/common';
import { EstadoPago, TipoPago } from '@prisma/client';
import { webServices } from 'src/data/constant/web-services.constant';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { PaymentCreateDto } from 'src/user/data/dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prismaService: PrismaService) {}

  async findAll(userId: number) {
    const user = await this.prismaService.usuario.findUnique({
      where: { id: userId, estado: 'ACTIVO' },
      include: { metodosPago: true },
    });

    return user?.metodosPago;
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

    const account: PaymentCreateDto = {
      estado: EstadoPago.ACTIVA,
      numero: accountNumber,
      tipo: type === 'credit' ? TipoPago.CREDITO : TipoPago.BANCO,
    };

    return { token: result.token, account };
  }
}
