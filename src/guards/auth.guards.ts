import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ITokenUserData } from 'src/interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const cookieToken = request.cookies['token'];

    if (!cookieToken) {
      throw new ForbiddenException('Токен не знайдено.');
    }

    const decodeToken: ITokenUserData = jwt.verify(
      cookieToken,
      process.env.SECRET_KEY,
    ) as ITokenUserData;

    if (!decodeToken || typeof decodeToken.role !== 'string') {
      throw new ForbiddenException('Термін дії токена минув.');
    }

    return true;
  }
}
