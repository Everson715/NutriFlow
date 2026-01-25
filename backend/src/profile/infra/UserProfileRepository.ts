import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Sex, ActivityLevel, UserProfile } from '@prisma/client';

@Injectable()
export class UserProfileRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByUserId(userId: string): Promise<UserProfile | null> {
    return this.prisma.userProfile.findUnique({
      where: { userId },
    });
  }

  async create(data: {
    userId: string;
    age: number;
    heightCm: number;
    weightKg: number;
    sex: Sex;
    activityLevel: ActivityLevel;
  }): Promise<UserProfile> {
    return this.prisma.userProfile.create({
      data,
    });
  }

  async updateByUserId(
    userId: string,
    data: {
      age: number;
      heightCm: number;
      weightKg: number;
      sex: Sex;
      activityLevel: ActivityLevel;
    },
  ): Promise<UserProfile> {
    return this.prisma.userProfile.update({
      where: { userId },
      data,
    });
  }
}
