import { Injectable } from '@nestjs/common';
import { EntitySchema, Repository } from 'typeorm';
import { Company } from '../companyModule/company/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ERole } from 'src/interface';
import { University } from '../universityModule/university/university.entity';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { HttpResponseHandler } from 'src/services/response/HttpResponseHandler';
import { TokenService } from '../tokenModule/token.service';
import { Recruiter } from '../companyModule/recruiter/recruiter.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
    private readonly tokenService: TokenService,
  ) {}

  async login(res: Response, userData: any) {
    try {
      let user: Company | Recruiter; /*| University;*/
      if (userData.role === ERole.company) {
        user = await this.companyRepository.findOne({
          where: { email: userData.email },
        });
      }
      if (userData.role === ERole.recruiter) {
        user = await this.recruiterRepository.findOne({
          where: { email: userData.email },
        });
      }

      if (!user) {
        return HttpResponseHandler.error({
          res,
          statusCode: 401,
          message: 'Невірний email чи пароль',
          error: 'Unauthorized',
        });
      }
      let decodePassword = bcrypt.compareSync(
        userData.password,
        user?.password,
      );
      if (!decodePassword || !user) {
        return HttpResponseHandler.error({
          res,
          statusCode: 4001,
          message: 'Невірний email чи пароль',
          error: 'Unauthorized',
        });
      }

      const userDataForTokens = {
        role: user.role,
        id: user.id,
        slug: user.slug,
        isActivated: user.isActivated,
        isVerified: user.isVerified,
      };

      const tokens = this.tokenService.generateTokens(userDataForTokens);
      await this.tokenService.saveToken(user.id, tokens.refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
      res.cookie('accessToken', tokens.accessToken, { httpOnly: true });

      return HttpResponseHandler.response({
        res,
        data: 'Auth',
        statusCode: 202,
      });
    } catch (error) {
      return HttpResponseHandler.error({
        res,
        message: error.message,
        error: error.name,
        statusCode: error.statusCode || 500,
      });
    }
  }

  async refresh(res: Response, req: Request) {
    try {
      const refreshToken = req.cookies;
      if (!refreshToken || typeof refreshToken !== 'string') {
        return HttpResponseHandler.error({
          res,
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Не знайдено токен',
        });
      }

      const userData = this.tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = this.tokenService.findToken(refreshToken);

      if (!tokenFromDb || !userData) {
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return HttpResponseHandler.error({
          res,
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Не знайдено токен',
        });
      }

      res.cookie('refreshToken', refreshToken, { httpOnly: true });
    } catch (error) {
      return HttpResponseHandler.error({
        res,
        message: error.message,
        error: error.name,
        statusCode: error.statusCode || 500,
      });
    }
  }

  async logout(res: Response, req: Request) {
    try {
      const refreshToken = req.cookies['refreshToken'];

      await this.tokenService.removeToken(refreshToken);

      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');

      return res.status(200);
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
