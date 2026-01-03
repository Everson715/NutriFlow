import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import type {
  LoginResponse,
  RegisterResponse,
  JwtPayload,
} from '../common/types/auth.types';

import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
  ): Promise<RegisterResponse> {
    return this.authService.register(dto);
  }

  /**
   * 🔐 Login com proteção contra brute force
   * 5 tentativas a cada 60 segundos
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({
    login: {
      ttl: 60,
    },
  })
  async login(
    @Body() dto: LoginDto,
  ): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  /**
   * ✅ Validação de token JWT
   */
  @Get('validate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  validate(
    @CurrentUser() user: JwtPayload,
  ): JwtPayload {
    return user;
  }
}
