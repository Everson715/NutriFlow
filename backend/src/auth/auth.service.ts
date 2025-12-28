import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ===============================
  // REGISTER
  // ===============================
  async register(data: RegisterDto): Promise<{ id: number; name: string; email: string }> {
    const { name, email, password } = data;

    try {
      const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

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
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        // Unique constraint failed
        throw new ConflictException('Usuário já existe');
      }

      this.logger.error('Erro ao registrar usuário', error as Error);
      throw error;
    }
  }

  private async findUserByEmail(email: string, withPassword = false) {
    return this.prisma.user.findUnique({
      where: { email },
      select: withPassword
        ? { id: true, email: true, password: true }
        : { id: true, name: true, email: true },
    });
  }

  // ===============================
  // LOGIN
  // ===============================
  async login(data: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = data;

    const user = await this.findUserByEmail(email, true);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
