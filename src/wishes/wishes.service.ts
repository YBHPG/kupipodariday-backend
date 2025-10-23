import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(data: Partial<Wish>): Promise<Wish> {
    const wish = this.wishesRepository.create(data);
    return this.wishesRepository.save(wish);
  }

  async findMany(query?: FindOptionsWhere<Wish>): Promise<Wish[]> {
    return this.wishesRepository.find({ where: query });
  }

  async findOne(query: FindOptionsWhere<Wish>): Promise<Wish | null> {
    return this.wishesRepository.findOne({ where: query });
  }

  async updateOne(
    query: FindOptionsWhere<Wish>,
    data: Partial<Wish>,
  ): Promise<Wish | null> {
    const wish = await this.findOne(query);
    if (!wish) return null;
    Object.assign(wish, data);
    return this.wishesRepository.save(wish);
  }

  async removeOne(query: FindOptionsWhere<Wish>): Promise<boolean> {
    const wish = await this.findOne(query);
    if (!wish) return false;
    await this.wishesRepository.remove(wish);
    return true;
  }
}
