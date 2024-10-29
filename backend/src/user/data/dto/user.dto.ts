import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole, UserState } from '../enum/user.enum';

export class UserDto {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  estado: UserState;
  rol: UserRole;
  fechaCreacion: Date;
  // cuentas: CuentaDto[];
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
  @IsEnum(UserState)
  estado: UserState;

  @IsNotEmpty()
  @IsEnum(UserState)
  rol: UserRole;
}
