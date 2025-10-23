import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Регистрация
  @Post('signup')
  async signup(@Body() body: Partial<User>) {
    return this.authService.signup(body);
  }

  // Авторизация
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req) {
    return this.authService.signin(req.user);
  }
}
