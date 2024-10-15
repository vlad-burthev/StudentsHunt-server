import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ITokenUserData } from 'src/interface';
import * as jwt from 'jsonwebtoken';
import { isJWT } from 'class-validator';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const cookieToken = request.cookies['accessToken'];

    if (!isJWT(cookieToken)) {
      response.clearCookie('refreshToken');
      response.clearCookie('accessToken');
      throw new ForbiddenException('Токен не знайдено.');
    }

    if (!cookieToken) {
      response.clearCookie('refreshToken');
      response.clearCookie('accessToken');
      throw new ForbiddenException('Токен не знайдено.');
    }

    const decodeToken: ITokenUserData = jwt.verify(
      cookieToken,
      process.env.SECRET_KEY,
    ) as ITokenUserData;

    if (!decodeToken || typeof decodeToken.role !== 'string') {
      response.clearCookie('refreshToken');
      response.clearCookie('accessToken');
      throw new ForbiddenException('Термін дії токена минув.');
    }

    return true;
  }
}
