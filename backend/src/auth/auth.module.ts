import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AUTH_CONSTANTS } from '../common/constants/auth.constants';

@Module({
  imports: [
    PrismaModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => {
        const expiresInEnv = configService.get('JWT_EXPIRES_IN');

        let expiresIn: StringValue | number;

        if (typeof expiresInEnv === 'number') {
          expiresIn = expiresInEnv;
        } else if (typeof expiresInEnv === 'string') {
          expiresIn = expiresInEnv as StringValue;
        } else {
          expiresIn = AUTH_CONSTANTS.JWT_EXPIRES_IN;
        }

        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
