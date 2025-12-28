import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Serviço para gerenciamento de usuários
 * Preparado para futuras implementações
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
}
