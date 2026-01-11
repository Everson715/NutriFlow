import { Module } from '@nestjs/common';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [MealsController],
  providers: [MealsService],
})
export class MealsModule {}
