import {
  Controller,
  Get,
  Query,
  Param,
  Patch,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Поиск по строке: email OR username
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('Missing or invalid token');
    }
    return this.usersService.findOne({ id: req.user.userId });
  }

  // Просмотр чужого профиля
  @Get(':id')
  async getById(@Param('id') id: string) {
    const userId = Number(id);
    return this.usersService.findOne({ id: userId });
  }

  // Просмотр своего профиля
  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  async me(@Req() req) {
    const me = await this.usersService.findOne({ id: req.user.userId });
    if (!me) return null;
    // Пароль скрыт глобально, email добавляем в явном виде по требованиям чек-листа
    return { ...me, email: (me as any).email };
  }

  // Редактирование своего профиля
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @Req() req,
    @Body() body: import('./dto/update-user.dto').UpdateUserDto,
  ) {
    // Нельзя редактировать чужой профиль
    const userId = req.user.userId;
    // Хеширование пароля переносим в сервис UsersService.updateOneIfOwner
    return this.usersService.updateOneIfOwner(userId, body);
  }
}
