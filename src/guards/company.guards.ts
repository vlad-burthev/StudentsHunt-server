import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ERole, ITokenUserData } from 'src/interface';
import * as jwt from 'jsonwebtoken';
import { isJWT } from 'class-validator';

@Injectable()
export class CompanyGuard implements CanActivate {
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
      process.env.JWT_SECRET_KEY,
    ) as ITokenUserData;

    if (!decodeToken || typeof decodeToken.role !== 'string') {
      throw new ForbiddenException('Термін дії токена минув.');
    }

    if (decodeToken.role !== ERole.company) {
      throw new ForbiddenException('Недостатньо прав.');
    }

    // if (!decodeToken.isActivated || !decodeToken.isVerified) {
    //   throw new ForbiddenException('Не перевірений користувач.');
    // }

    //console.log(cookieToken);

    return true;
  }
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY29tcGFueSIsImlkIjoiZTQzMzE0MjEtZDMzNi00ODYzLTg1ZDEtZmE2OGRhMjUyZTRkIiwic2x1ZyI6ItC90LDRhtGW0L7QvdCw0LvRjNC90LjQuV_Rg9C90ZbQstC10YDRgdC40YLQtdGCX9Cx0ZbQvtGA0LXRgdGD0YDRgdGW0LJf0ZZf0L_RgNC40YDQvtC00L7QutC-0YDQuNGB0YLRg9Cy0LDQvdC90Y9f0YPQutGA0LDRl9C90LhfNzc3ZjI5NzktOTEyZi00MmZhLTkxOTUtOGViODExNWRkZmRjIiwiaXNBY3RpdmF0ZWQiOmZhbHNlLCJpYXQiOjE3Mjg1NTgxNzQsImV4cCI6MTcyODY0NDU3NH0.QKWqHwyXAZ0clZGKZzUhclOdSr9QuvfZNMVpQGEkl28
