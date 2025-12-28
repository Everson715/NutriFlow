import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AUTH_CONSTANTS } from '../common/constants/auth.constants';

const jwtExpiresIn: StringValue | number =
  (process.env.JWT_EXPIRES_IN as StringValue) ??
  AUTH_CONSTANTS.JWT_EXPIRES_IN;

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET as string,
      signOptions: {
        expiresIn: jwtExpiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
