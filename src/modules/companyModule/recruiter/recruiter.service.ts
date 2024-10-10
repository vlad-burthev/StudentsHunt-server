import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateRecruiterDTO } from './recruiter.dto';
import { HttpResponseHandler } from 'src/services/response/HttpResponseHandler';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecruiterService {
  constructor(private readonly configService: ConfigService) {}

  async createRecruiterService(
    req: Request,
    res: Response,
    // createData: CreateRecruiterDTO,
  ) {
    try {
      const accessToken = req.cookies['accessToken'];

      const decodeToken = jwt.verify(
        accessToken,
        this.configService.get<string>('JWT_SECRET_KEY'),
      );

      console.log(decodeToken);

      return res.json('ok');
    } catch (error) {
      return HttpResponseHandler.error({
        res,
        message: error.message,
        error: error.name,
        statusCode: error.statusCode || 500,
      });
    }
  }
}
