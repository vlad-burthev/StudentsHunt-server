import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { config } from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет свойства, которые не указаны в DTO
      forbidNonWhitelisted: true, // выбрасывает ошибку, если присутствуют неразрешенные свойства
      transform: true, // автоматически преобразует входящие объекты в указанные классы DTO
    }),
  );

  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }),
  );

  // Настройка безопасности с помощью Helmet
  app.use(helmet());

  // Настройка логирования запросов с помощью Morgan
  app.use(morgan('dev'));

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'auth/google/callback', method: RequestMethod.GET },
      { path: 'auth/google/login', method: RequestMethod.GET },
    ],
  });

  // Указываем, что папка `uploads` должна быть доступна как статическая
  // app.useStaticAssets(join(__dirname, '..', 'uploads'));

  await app.listen(parseInt(process.env.PORT));
}
bootstrap();
