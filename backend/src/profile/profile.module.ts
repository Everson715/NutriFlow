import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';

import { PrismaService } from '../prisma/prisma.service';

import { UserProfileRepository } from './infra/UserProfileRepository';
import { RequireUserProfile } from './infra/RequireUserProfile';

import { CreateProfile } from './application/CreateProfile';
import { UpdateProfile } from './application/UpdateProfile';
import { GetProfile } from './application/GetProfile';

@Module({
  controllers: [ProfileController],
  providers: [
    PrismaService,

    // Infra
    UserProfileRepository,
    RequireUserProfile,

    // Use cases
    CreateProfile,
    UpdateProfile,
    GetProfile,
  ],
  exports: [
    RequireUserProfile,
  ],
})
export class ProfileModule {}
