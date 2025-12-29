import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy';
import { UsersModule } from '../users/users.module';
import { AUTH_CONSTANTS } from '../common/constants/auth.constants';

@Module({
  imports: [
    UsersModule,
    ConfigModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresInEnv = configService.get<string | number | undefined>('JWT_EXPIRES_IN');

        let expiresIn: number | StringValue;

        if (typeof expiresInEnv === 'number'){
          expiresIn = expiresInEnv;
        }else if (typeof expiresInEnv === 'string'){
          expiresIn = expiresInEnv as StringValue;

        }else{
          expiresIn = AUTH_CONSTANTS.JWT_EXPIRES_IN;
        }

        return {
          secret: configService.get<string>('JWT_SECRET')!,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}