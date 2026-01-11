import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateMealDto,
  ) {
    return this.mealsService.create(user.sub, dto);
  }

  @Get('today')
  findToday(
    @CurrentUser() user: { sub: string },
  ) {
    return this.mealsService.findToday(user.sub);
  }
}
