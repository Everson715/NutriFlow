import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../users/user.repository';
import {
  AUTH_CONSTANTS,
  AUTH_ERROR_MESSAGES,
} from '../common/constants/auth.constants';
import type {
  RegisterResponse,
  JwtPayload,
} from '../common/types/auth.types';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async register(data: RegisterDto): Promise<RegisterResponse> {
    const { name, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new ConflictException(
        AUTH_ERROR_MESSAGES.USER_ALREADY_EXISTS,
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      AUTH_CONSTANTS.SALT_ROUNDS,
    );

    return this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  async login(data: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = data;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException(
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
