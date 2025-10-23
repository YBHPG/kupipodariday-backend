import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Создание пользователя
  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  // Поиск всех пользователей с фильтром (если передан)
  async findMany(query?: FindOptionsWhere<User>): Promise<User[]> {
    return this.usersRepository.find({ where: query });
  }

  // Поиск одного пользователя
  async findOne(query: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersRepository.findOne({ where: query });
  }

  // Обновление пользователя
  async updateOne(
    query: FindOptionsWhere<User>,
    updateData: Partial<User>,
  ): Promise<User | null> {
    const user = await this.findOne(query);
    if (!user) return null;
    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }

  // Удаление пользователя
  async removeOne(query: FindOptionsWhere<User>): Promise<boolean> {
    const user = await this.findOne(query);
    if (!user) return false;
    await this.usersRepository.remove(user);
    return true;
  }
}
