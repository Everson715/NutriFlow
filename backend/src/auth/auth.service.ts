import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import {
  AUTH_CONSTANTS,
  AUTH_ERROR_MESSAGES,
} from '../common/constants/auth.constants';
import {
  LoginResponse,
  RegisterResponse,
  JwtPayload,
} from '../common/types/auth.types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<RegisterResponse> {
    const { name, email, password } = data;

    try {
      const hashedPassword = await this.hashPassword(password);

      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          AUTH_ERROR_MESSAGES.USER_ALREADY_EXISTS,
        );
      }
      this.logger.error('Erro ao registrar usuário', error as Error);
      throw error;
    }
  }

  async login(data: LoginDto): Promise<LoginResponse> {
    const { email, password } = data;

    const user = await this.findUserByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException(
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }

  private async findUserByEmail(
    email: string,
    includePassword = false,
  ): Promise<{
    id: string;
    name: string;
    email: string;
    password?: string;
  } | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: includePassword
        ? { id: true, name: true, email: true, password: true }
        : { id: true, name: true, email: true },
    });
  }

  private async findUserByEmailWithPassword(
    email: string,
  ): Promise<{ id: string; email: string; password: string } | null> {
    return this.findUserByEmail(email, true) as Promise<{
      id: string;
      email: string;
      password: string;
    } | null>;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, AUTH_CONSTANTS.SALT_ROUNDS);
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
