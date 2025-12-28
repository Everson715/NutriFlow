import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  INestApplication,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Prisma connected to the database');
    } catch (error) {
      this.logger.error(
        'Error connecting Prisma to the database',
        error as Error,
      );
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
      this.logger.log('Prisma disconnected from the database');
    } catch (error) {
      this.logger.error(
        'Error disconnecting Prisma from the database',
        error as Error,
      );
    }
  }

  /**
   * Habilita hooks de shutdown para fechar a aplicação graciosamente
   * @param app - Instância da aplicação NestJS
   */
  async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}