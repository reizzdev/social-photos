import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getWallet(@Req() req: any) {
    return this.walletService.getWallet(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  getTransactions(@Req() req: any) {
    return this.walletService.getTransactions(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('contributions')
  getContributions(@Req() req: any) {
    return this.walletService.getContributions(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('contribute')
  contribute(
    @Req() req: any,
    @Body() body: { collection_id: string; amount: number },
  ) {
    return this.walletService.contribute(req.user.userId, body.collection_id, body.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  addFanblys(
    @Req() req: any,
    @Body() body: { amount: number; description: string },
  ) {
    return this.walletService.addFanblys(req.user.userId, body.amount, body.description);
  }
}