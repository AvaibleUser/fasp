import { EstadoUsuario, RolUsuario } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { PaymentDto } from './payment.dto';

export class UserDto {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  estado: EstadoUsuario;
  rol: RolUsuario;
  fechaCreacion: Date;
  metodosPago?: PaymentDto[];
}

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(EstadoUsuario)
  estado: EstadoUsuario;

  @IsNotEmpty()
  @IsEnum(RolUsuario)
  rol: RolUsuario;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  saldo: number;
}
