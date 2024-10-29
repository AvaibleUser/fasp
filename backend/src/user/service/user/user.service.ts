import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findOne(email: string): Promise<any | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
}
