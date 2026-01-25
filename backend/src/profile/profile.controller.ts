import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { CreateProfile } from './application/CreateProfile';
import { UpdateProfile } from './application/UpdateProfile';
import { GetProfile } from './application/GetProfile';

import { Sex, ActivityLevel } from '@prisma/client';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly createProfile: CreateProfile,
    private readonly updateProfile: UpdateProfile,
    private readonly getProfile: GetProfile,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: { userId: string },
    @Body()
    body: {
      age: number;
      heightCm: number;
      weightKg: number;
      sex: Sex;
      activityLevel: ActivityLevel;
    },
  ) {
    return this.createProfile.execute({
      userId: user.userId,
      ...body,
    });
  }

  @Put()
  async update(
    @CurrentUser() user: { userId: string },
    @Body()
    body: {
      age: number;
      heightCm: number;
      weightKg: number;
      sex: Sex;
      activityLevel: ActivityLevel;
    },
  ) {
    return this.updateProfile.execute({
      userId: user.userId,
      ...body,
    });
  }

  @Get()
  async me(
    @CurrentUser() user: { userId: string },
  ) {
    return this.getProfile.execute(user.userId);
  }
}
