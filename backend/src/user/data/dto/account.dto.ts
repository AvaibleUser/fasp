import { EstadoCuenta, TipoFinanza } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';
import { UserDto } from './user.dto';

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

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @IsEnum(TipoFinanza)
  tipo: TipoFinanza;
}
