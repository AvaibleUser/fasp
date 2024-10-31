import { TipoPago } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class TransactionCreateDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  monto: number;

  @IsNotEmpty()
  @IsString()
  usernameReceptor: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tipoPago: TipoPago;
}
