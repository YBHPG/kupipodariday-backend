import {
  Injectable,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { User } from './entities/user.entity';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    try {
      return await this.usersRepository.save(userData);
    } catch (e: any) {
      if (e?.code === '23505') {
        throw new ConflictException('Email or username already exists');
      }
      throw e;
    }
    return this.usersRepository.save(userData);
  }

  async findOne(query: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersRepository.findOne({
      where: query,
      relations: ['wishes', 'wishlists'],
    });
  }

  async findMany(query: FindOptionsWhere<User>): Promise<User[]> {
    return this.usersRepository.find({ where: query });
  }

  async updateOne(
    query: FindOptionsWhere<User>,
    update: Partial<User>,
  ): Promise<boolean> {
    const result = await this.usersRepository.update(query, update);
    return result.affected ? result.affected > 0 : false;
  }

  async removeOne(query: FindOptionsWhere<User>): Promise<boolean> {
    const user = await this.findOne(query);
    if (!user) return false;
    await this.usersRepository.remove(user);
    return true;
  }

  // Новый метод: поиск по строке (email ИЛИ username) с ILike
  async searchByQuery(q: string): Promise<User[]> {
    const s = q.trim();
    if (!s) return [];
    return this.usersRepository.find({
      where: [{ email: ILike(`%${s}%`) }, { username: ILike(`%${s}%`) }],
    });
  }

  // Редактирование своего профиля. Если передан password — хешируем.
  async updateOneIfOwner(
    userId: number,
    body: Partial<User>,
  ): Promise<boolean> {
    const { password, ...rest } = body ?? {};
    const update: Partial<User> = { ...rest };

    if (password) {
      update.password = await this.hashService.hash(password);
    }

    try {
      const result = await this.usersRepository.update({ id: userId }, update);
      return result.affected ? result.affected > 0 : false;
    } catch (e: any) {
      if (e?.code === '23505') {
        throw new ConflictException('Email or username already exists');
      }
      throw e;
    }
  }
}
