import { TipoFinanza } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { AccountDto } from './account.dto';

export type FinanceDto = {
  id: number;
  nombre: string;
  tipo: TipoFinanza;
  cuenta: AccountDto;
};

export class FinanceCreateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @IsEnum(TipoFinanza)
  tipo: TipoFinanza;
}
