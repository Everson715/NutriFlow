import { Sex, ActivityLevel } from '@prisma/client';
import { UserProfileValidator } from '../domain/UserProfileValidator';
import { UserProfileNotFoundError } from '../domain/UserProfileErrors';
import { UserProfileRepository } from '../infra/UserProfileRepository';

export interface UpdateProfileInput {
  userId: string;
  age: number;
  heightCm: number;
  weightKg: number;
  sex: Sex;
  activityLevel: ActivityLevel;
}

export class UpdateProfile {
  constructor(
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  async execute(input: UpdateProfileInput) {
    const { userId, ...profileData } = input;

    const existingProfile =
      await this.userProfileRepository.findByUserId(userId);

    if (!existingProfile) {
      throw new UserProfileNotFoundError();
    }

    UserProfileValidator.validate(profileData);

    return this.userProfileRepository.updateByUserId(
      userId,
      profileData,
    );
  }
}
