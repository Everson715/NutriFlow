// src/profile/infra/RequireUserProfile.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserProfileRepository } from './UserProfileRepository';

@Injectable()
export class RequireUserProfile implements CanActivate {
  constructor(
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user as { userId?: string };

    if (!user || !user.userId) {
      // Isso normalmente não acontece se o AuthGuard já rodou
      throw new ForbiddenException('User not authenticated');
    }

    const profile =
      await this.userProfileRepository.findByUserId(user.userId);

    if (!profile) {
      throw new ForbiddenException(
        'User profile is required to access this resource',
      );
    }

    return true;
  }
}
