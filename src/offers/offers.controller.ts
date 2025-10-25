import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body() body: import('./dto/create-offer.dto').CreateOfferDto,
  ) {
    return this.offersService.create(req.user.userId, body);
  }
}
