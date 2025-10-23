import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist])],
  providers: [WishlistsService],
  controllers: [WishlistsController],
  exports: [WishlistsService],
})
export class WishlistsModule {}
