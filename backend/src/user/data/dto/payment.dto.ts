import { EstadoPago, TipoPago } from '@prisma/client';
import { UserDto } from './user.dto';

export type PaymentDto = {
  id: number;
  usuarioId: number;
  usuario: UserDto;
  estado: EstadoPago;
  fechaCreacion: Date;
  // entidadFinanciera: EntidadFinancieraDto;
  // transaccionesEnviadas: TransaccionDto[];
  // transaccionesRecibidas: TransaccionDto[];
};

export class PaymentCreateDto {
  estado: EstadoPago;

  numero: number;

  tipo: TipoPago;
}
