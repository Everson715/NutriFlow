export class UserProfileAlreadyExistsError extends Error {
  constructor() {
    super('User profile already exists');
  }
}

export class UserProfileNotFoundError extends Error {
  constructor() {
    super('User profile not found');
  }
}

export class InvalidAgeError extends Error {
  constructor(age: number) {
    super(`Invalid age: ${age}`);
  }
}

export class InvalidHeightError extends Error {
  constructor(heightCm: number) {
    super(`Invalid height: ${heightCm}`);
  }
}

export class InvalidWeightError extends Error {
  constructor(weightKg: number) {
    super(`Invalid weight: ${weightKg}`);
  }
}

export class MissingSexError extends Error {
  constructor() {
    super('Sex is required');
  }
}

export class MissingActivityLevelError extends Error {
  constructor() {
    super('Activity level is required');
  }
}
