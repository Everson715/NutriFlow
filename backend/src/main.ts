import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

const DEFAULT_PORT = 5000;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // ✅ CORRETO
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT
    ? Number(process.env.PORT)
    : DEFAULT_PORT;

  await app.listen(port);
}

bootstrap();
