import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

/**
 * Serviço para gerenciamento de usuários
 * Preparado para futuras implementações
 */
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
}
