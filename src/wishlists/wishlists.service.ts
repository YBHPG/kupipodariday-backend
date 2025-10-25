import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { In } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(ownerId: number, data: CreateWishlistDto): Promise<Wishlist> {
    const owner = await this.usersRepository.findOne({
      where: { id: ownerId },
    });
    if (!owner) throw new NotFoundException('Owner not found');

    // items — массив id подарков
    let items: Wish[] | undefined = undefined;
    if (Array.isArray((data as any).items)) {
      items = await this.wishesRepository.findBy({ id: In(data.items) });
    }

    const list = this.wishlistsRepository.create({
      name: data.name,
      description: data.description,
      image: data.image,
      owner,
      items,
    });
    return this.wishlistsRepository.save(list);
  }

  async findOne(query: FindOptionsWhere<Wishlist>): Promise<Wishlist | null> {
    return this.wishlistsRepository.findOne({
      where: query,
      relations: ['owner', 'items'],
    });
  }

  async findMany(query: FindOptionsWhere<Wishlist>): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      where: query,
      relations: ['owner', 'items'],
    });
  }

  async updateOneOwnerGuard(
    ownerId: number,
    id: number,
    patch: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const list = await this.findOne({ id });
    if (!list) throw new NotFoundException('Wishlist not found');
    if (list.owner.id !== ownerId)
      throw new ForbiddenException('Cannot edit others wishlists');

    if (Array.isArray((patch as any).items)) {
      const items = await this.wishesRepository.findByIds((patch as any).items);
      (list as any).items = items;
      delete (patch as any).items;
    }

    Object.assign(list, patch);
    return this.wishlistsRepository.save(list);
  }

  async removeOneOwnerGuard(ownerId: number, id: number): Promise<boolean> {
    const list = await this.findOne({ id });
    if (!list) return false;
    if (list.owner.id !== ownerId)
      throw new ForbiddenException('Cannot delete others wishlists');
    await this.wishlistsRepository.remove(list);
    return true;
  }
}
