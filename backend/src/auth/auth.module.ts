import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true, // Recommended for Auth modules
      secret: process.env.JWT_SECRET,
      signOptions: {
        // Casting to any or ensuring it's a string helps TS accept it
        expiresIn: (process.env.JWT_EXPIRES_IN as any) || '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}