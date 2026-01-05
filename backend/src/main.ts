import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const DEFAULT_PORT = 5000;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilita CORS para o frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://192.168.0.89:3000',
    ],
    credentials: true,
  });

  // ✅ Pipes globais de validação (estão corretos)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT
    ? Number(process.env.PORT)
    : DEFAULT_PORT;

  await app.listen(port);

  console.log(`🚀 Backend running on http://localhost:${port}`);
}

bootstrap();
