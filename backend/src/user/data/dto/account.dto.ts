import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { AccountStatus } from '../enum/account.enum';
import { UserDto } from './user.dto';

export type AccountDto = {
  id: number;
  usuarioId: number;
  usuario: UserDto;
  saldo: number;
  estado: AccountStatus;
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
  @IsEnum(AccountStatus)
  estado: AccountStatus;
}
