import { TipoTransaccion } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class TransactionCreateDto {
  @IsNotEmpty()
  @IsEnum(TipoTransaccion)
  tipo: TipoTransaccion;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  monto: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cuentaOrigenId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cuentaDestinoId: number;
}
