import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transaccion } from '@prisma/client';
import { webServices } from 'src/data/constant/web-services.constant';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { TransactionCreateDto } from 'src/transaction/data/dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prismaService: PrismaService) {}

  async findAll(userId: number, from: Date, to: Date = new Date()) {
    return await this.prismaService.transaccion.findMany({
      where: {
        OR: [{ emisorId: userId }, { receptorId: userId }],
        fecha: { gte: from, lte: to },
        estado: 'EXITOSA',
      },
    });
  }

  async create(
    data: TransactionCreateDto,
    emisorId: number,
  ): Promise<Transaccion> {
    const { numero, usernameReceptor, ...transaccion } = data;

    const metodoPago = !numero
      ? undefined
      : await this.prismaService.metodoPago.findFirst({
          where: { numero, usuarioId: emisorId },
        });

    const pendingTransaction = await this.prismaService.transaccion.create({
      data: {
        ...transaccion,
        emisor: { connect: { id: emisorId } },
        receptor: { connect: { username: usernameReceptor } },
        metodoPago: metodoPago ? { connect: { id: metodoPago.id } } : undefined,
      },
      include: {
        emisor: true,
        receptor: true,
      },
    });

    try {
      if (metodoPago) {
        await this.changeAmount(
          true,
          +metodoPago.numero,
          pendingTransaction.monto,
          metodoPago.tipo,
        );

        return await this.prismaService.transaccion.update({
          where: { id: pendingTransaction.id },
          data: {
            estado: 'EXITOSA',
            receptor: {
              update: {
                where: { id: pendingTransaction.receptorId },
                data: { saldo: { increment: pendingTransaction.monto } },
              },
            },
          },
          include: { metodoPago: { select: { tipo: true } } },
        });
      }
      if (pendingTransaction.emisor.saldo < pendingTransaction.monto) {
        throw new ConflictException('No hay suficiente saldo');
      }

      return await this.prismaService.transaccion.update({
        where: { id: pendingTransaction.id },
        data: {
          estado: 'EXITOSA',
          receptor: {
            update: {
              where: { id: pendingTransaction.receptorId },
              data: { saldo: { increment: pendingTransaction.monto } },
            },
          },
          emisor: {
            update: {
              where: { id: pendingTransaction.emisorId },
              data: { saldo: { decrement: pendingTransaction.monto } },
            },
          },
        },
        include: { metodoPago: { select: { tipo: true } } },
      });
    } catch (error) {
      await this.prismaService.transaccion.update({
        where: { id: pendingTransaction.id },
        data: {
          estado: 'FALLIDA',
          errores: error.message,
        },
      });

      throw error;
    }
  }

  private async changeAmount(
    reduce: boolean,
    accountNumber: number,
    amount: number,
    type: 'CREDITO' | 'BANCO',
  ): Promise<number | undefined> {
    const service = type === 'CREDITO' ? webServices.credit : webServices.bank;

    if (!service.host) {
      throw new NotFoundException('El servicio esta en mantenimiento');
    }

    const amountToUse = amount * (reduce ? -1 : 1);
    const body = {
      account_number: accountNumber,
      amount: amountToUse,
      numeroTarjeta: accountNumber.toString(),
      montoReducir: amountToUse,
    };

    const response = await fetch(
      `${service.host}/${reduce ? service.endpoints.reduce : service.endpoints.add}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new BadRequestException(result.error ?? 'No se encontro la cuenta');
    }

    return result.nuevoSaldo;
  }
}
