import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { FinanceType } from '../enum/finance.enum';
import { AccountDto } from './account.dto';

export type FinanceDto = {
  id: number;
  nombre: string;
  tipo: FinanceType;
  cuenta: AccountDto;
};

export class FinanceCreateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @IsEnum(FinanceType)
  tipo: FinanceType;
}
