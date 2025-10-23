import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Offer } from './entities/offers.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
  ) {}

  async create(data: Partial<Offer>): Promise<Offer> {
    const offer = this.offersRepository.create(data);
    return this.offersRepository.save(offer);
  }

  async findMany(query?: FindOptionsWhere<Offer>): Promise<Offer[]> {
    return this.offersRepository.find({ where: query });
  }

  async findOne(query: FindOptionsWhere<Offer>): Promise<Offer | null> {
    return this.offersRepository.findOne({ where: query });
  }

  async updateOne(
    query: FindOptionsWhere<Offer>,
    data: Partial<Offer>,
  ): Promise<Offer | null> {
    const offer = await this.findOne(query);
    if (!offer) return null;
    Object.assign(offer, data);
    return this.offersRepository.save(offer);
  }

  async removeOne(query: FindOptionsWhere<Offer>): Promise<boolean> {
    const offer = await this.findOne(query);
    if (!offer) return false;
    await this.offersRepository.remove(offer);
    return true;
  }
}
