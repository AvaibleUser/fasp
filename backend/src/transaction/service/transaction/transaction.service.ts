import { Injectable } from '@nestjs/common';
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
        OR: [{ cuentaOrigenId: userId }, { cuentaDestinoId: userId }],
        fecha: { gte: from, lte: to },
        estado: 'EXITOSA',
      },
    });
  }

  async create(data: TransactionCreateDto): Promise<Transaccion> {
    const { cuentaOrigenId, cuentaDestinoId, ...transaccion } = data;

    const pendingTransaction = await this.prismaService.transaccion.create({
      data: {
        ...transaccion,
        estado: 'PENDIENTE',
        cuentaOrigen: cuentaOrigenId
          ? { connect: { id: cuentaOrigenId } }
          : undefined,
        cuentaDestino: cuentaDestinoId
          ? { connect: { id: cuentaDestinoId } }
          : undefined,
      },
      include: {
        cuentaOrigen: true,
        cuentaDestino: true,
      },
    });

    try {
      if (cuentaOrigenId && cuentaDestinoId) {
        await this.transfer(pendingTransaction);

        return await this.prismaService.transaccion.update({
          where: { id: pendingTransaction.id },
          data: {
            estado: 'EXITOSA',
          },
        });
      } else if (cuentaOrigenId) {
        await this.changeAmount(
          true,
          +cuentaOrigenId,
          pendingTransaction.monto,
          pendingTransaction.cuentaOrigen.tipo,
        );

        return await this.prismaService.transaccion.update({
          where: { id: pendingTransaction.id },
          data: {
            estado: 'EXITOSA',
            cuentaOrigen: {
              update: {
                where: { id: cuentaOrigenId },
                data: {
                  usuario: {
                    update: {
                      where: { id: pendingTransaction.cuentaOrigen.usuarioId },
                      data: { saldo: { increment: pendingTransaction.monto } },
                    },
                  },
                },
              },
            },
          },
        });
      } else if (cuentaDestinoId) {
        await this.changeAmount(
          false,
          +cuentaDestinoId,
          pendingTransaction.monto,
          pendingTransaction.cuentaDestino.tipo,
        );

        return await this.prismaService.transaccion.update({
          where: { id: pendingTransaction.id },
          data: {
            estado: 'EXITOSA',
            cuentaDestino: {
              update: {
                where: { id: cuentaDestinoId },
                data: {
                  usuario: {
                    update: {
                      where: { id: pendingTransaction.cuentaDestino.usuarioId },
                      data: { saldo: { decrement: pendingTransaction.monto } },
                    },
                  },
                },
              },
            },
          },
        });
      } else {
        throw new Error('La transacción es defectuosa');
      }
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
      throw new Error('El servicio esta en mantenimiento');
    }

    const amountToUse = amount * (reduce ? -1 : 1);
    const body = {
      account_number: accountNumber,
      amount: amountToUse,
      numeroTarjeta: accountNumber.toString(),
      montoReducir: 2999.0,
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
      throw new Error(result.error ?? 'No se encontro la cuenta');
    }

    return result.nuevoSaldo;
  }

  private async transfer(pendingTransaction) {
    try {
      await this.changeAmount(
        true,
        +pendingTransaction.cuentaOrigen.nombre,
        pendingTransaction.monto,
        pendingTransaction.cuentaOrigen.tipo,
      );
      await this.changeAmount(
        false,
        +pendingTransaction.cuentaDestino.nombre,
        pendingTransaction.monto,
        pendingTransaction.cuentaDestino.tipo,
      );
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
}
