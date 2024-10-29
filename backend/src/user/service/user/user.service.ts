import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { AccountCreateDto } from 'src/user/data/dto/account.dto';
import { FinanceCreateDto } from 'src/user/data/dto/finance.dto';
import { UserCreateDto, UserDto } from 'src/user/data/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(
    data: UserCreateDto,
    account: AccountCreateDto,
    finanza: FinanceCreateDto,
  ): Promise<UserDto> {
    return this.prismaService.user.create({
      data: {
        ...data,
        cuentas: {
          create: [{ ...account, finanza: { create: [{ ...finanza }] } }],
        },
      },
    });
  }

  async findOne(username: string): Promise<UserDto | undefined> {
    return this.prismaService.user.findUnique({
      where: { OR: [{ username }, { email: username }] },
    });
  }
}
