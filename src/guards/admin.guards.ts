import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { isJWT } from 'class-validator';
import { config } from 'dotenv';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ERole, ITokenUserData } from 'src/interface';

config();

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const cookieToken = request.cookies['accessToken'];

    if (!isJWT(cookieToken)) {
      throw new ForbiddenException('Токен не знайдено.');
    }

    if (!cookieToken) {
      throw new ForbiddenException('Токен не знайдено.');
    }
    const decodeToken: ITokenUserData = jwt.verify(
      cookieToken,
      process.env.SECRET_KEY,
    ) as ITokenUserData;

    if (!decodeToken || decodeToken.role !== ERole.admin) {
      throw new ForbiddenException(
        'Доступ заборонений: ви не є адміністратором.',
      );
    }

    return true; // Если всё в порядке, разрешаем доступ
  }
}
