import { Body, Controller, Post } from '@nestjs/common';
import { TransactionCreateDto } from 'src/transaction/data/dto/transaction.dto';
import { TransactionService } from 'src/transaction/service/transaction/transaction.service';

@Controller('api/transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('create')
  async create(@Body() createDto: TransactionCreateDto) {
    return this.transactionService.create(createDto);
  }
}
