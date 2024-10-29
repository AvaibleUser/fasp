import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { UserDto } from './user.dto';
import { EstadoCuenta } from '@prisma/client';

export type AccountDto = {
  id: number;
  usuarioId: number;
  usuario: UserDto;
  saldo: number;
  estado: EstadoCuenta;
  fechaCreacion: Date;
  entidadFinancieraId: number;
  // entidadFinanciera: EntidadFinancieraDto;
  // transaccionesEnviadas: TransaccionDto[];
  // transaccionesRecibidas: TransaccionDto[];
};

export class AccountCreateDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  saldo: number;

  @IsNotEmpty()
  @IsEnum(EstadoCuenta)
  estado: EstadoCuenta;
}
