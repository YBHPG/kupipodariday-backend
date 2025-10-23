import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(data: Partial<Wishlist>): Promise<Wishlist> {
    const wishlist = this.wishlistsRepository.create(data);
    return this.wishlistsRepository.save(wishlist);
  }

  async findMany(query?: FindOptionsWhere<Wishlist>): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({ where: query });
  }

  async findOne(query: FindOptionsWhere<Wishlist>): Promise<Wishlist | null> {
    return this.wishlistsRepository.findOne({ where: query });
  }

  async updateOne(
    query: FindOptionsWhere<Wishlist>,
    data: Partial<Wishlist>,
  ): Promise<Wishlist | null> {
    const wishlist = await this.findOne(query);
    if (!wishlist) return null;
    Object.assign(wishlist, data);
    return this.wishlistsRepository.save(wishlist);
  }

  async removeOne(query: FindOptionsWhere<Wishlist>): Promise<boolean> {
    const wishlist = await this.findOne(query);
    if (!wishlist) return false;
    await this.wishlistsRepository.remove(wishlist);
    return true;
  }
}
