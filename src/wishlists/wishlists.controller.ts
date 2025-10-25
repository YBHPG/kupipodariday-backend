import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.wishlistsService.findOne({ id: Number(id) });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async myLists(@Req() req) {
    return this.wishlistsService.findMany({
      owner: { id: req.user.userId } as any,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body() body: import('./dto/create-wishlist.dto').CreateWishlistDto,
  ) {
    return this.wishlistsService.create(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() body: import('./dto/update-wishlist.dto').UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateOneOwnerGuard(
      req.user.userId,
      Number(id),
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.wishlistsService.removeOneOwnerGuard(
      req.user.userId,
      Number(id),
    );
  }
}
