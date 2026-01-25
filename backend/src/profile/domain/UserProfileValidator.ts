import { Sex, ActivityLevel } from '@prisma/client';
import {
  InvalidAgeError,
  InvalidHeightError,
  InvalidWeightError,
  MissingSexError,
  MissingActivityLevelError,
} from './UserProfileErrors';

export interface UserProfileValidatorInput {
  age: number;
  heightCm: number;
  weightKg: number;
  sex: Sex;
  activityLevel: ActivityLevel;
}

export class UserProfileValidator {
  static validate(input: UserProfileValidatorInput): void {
    const { age, heightCm, weightKg, sex, activityLevel } = input;

    if (!sex) {
      throw new MissingSexError();
    }

    if (!activityLevel) {
      throw new MissingActivityLevelError();
    }

    if (!age || age <= 0) {
      throw new InvalidAgeError(age);
    }

    if (!heightCm || heightCm <= 0) {
      throw new InvalidHeightError(heightCm);
    }

    if (!weightKg || weightKg <= 0) {
      throw new InvalidWeightError(weightKg);
    }
  }
}
