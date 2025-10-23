import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offers.entity';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  providers: [OffersService],
  controllers: [OffersController],
  exports: [OffersService],
})
export class OffersModule {}
