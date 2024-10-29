import { EstadoUsuario, RolUsuario } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AccountDto } from './account.dto';

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
  cuentas?: AccountDto[];
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
}
