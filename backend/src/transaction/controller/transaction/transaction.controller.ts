import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionCreateDto } from 'src/transaction/data/dto/transaction.dto';
import { TransactionService } from 'src/transaction/service/transaction/transaction.service';

@Controller('api')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get('users/:userId/transactions')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('userId') userId: number,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    return this.transactionService.findAll(userId, from, to ?? new Date());
  }

  @Post('transactions/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: TransactionCreateDto) {
    return this.transactionService.create(createDto);
  }
}
