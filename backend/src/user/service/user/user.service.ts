import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { UserCreateDto, UserDto } from 'src/user/data/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(data: UserCreateDto): Promise<UserDto> {
    return this.prismaService.user.create({ data });
  }

  async findOne(username: string): Promise<UserDto | undefined> {
    return this.prismaService.user.findUnique({
      where: { OR: [{ username }, { email: username }] },
    });
  }
}
