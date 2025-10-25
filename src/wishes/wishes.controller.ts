import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  async last() {
    return this.wishesService.latest();
  }

  @Get('top')
  async top() {
    return this.wishesService.top();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.wishesService.findOne({ id: Number(id) });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body() body: import('./dto/create-wish.dto').CreateWishDto,
  ) {
    return this.wishesService.create(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() body: import('./dto/update-wish.dto').UpdateWishDto,
  ) {
    return this.wishesService.updateOneOwnerGuard(
      req.user.userId,
      Number(id),
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.wishesService.removeOneOwnerGuard(req.user.userId, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copy(@Req() req, @Param('id') id: string) {
    return this.wishesService.copy(Number(id), req.user.userId);
  }
}
