import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';

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
  app.use(cors());

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.cookie('token', '', {
      httpOnly: true,
      // secure: true, // Используйте true только на HTTPS
    });
    next();
  });

  await app.listen(3000);
}
bootstrap();
