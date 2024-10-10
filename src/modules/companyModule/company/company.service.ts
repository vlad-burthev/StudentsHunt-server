import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateCompanyDto } from './company.dto';
import { Company } from './company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpResponseHandler } from 'src/services/response/HttpResponseHandler';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { getNameFromEgrpou } from 'src/common/getNameFromEgrpou';
import { generateSlug } from 'src/common/generateSlug';
import { ConvertToWebp } from 'src/common/convertToWebp';
import { EgrpouService } from 'src/modules/egrpouModule/egrpou.service';
import { EGRPOU } from 'src/modules/egrpouModule/egrpou.entity';
import { TokenService } from 'src/modules/tokenModule/token.service';
import { MailService } from 'src/services/mail/mailService';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(EGRPOU)
    private readonly egrpouRepository: Repository<EGRPOU>,

    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private egrpouService: EgrpouService,
  ) {}

  async getCompany(res: Response) {
    const company = await this.companyRepository.findOne({
      where: { id: 'de6ceebc-b5df-4a26-8b20-dc31295a2bfd' },
    });
    return res.json(company);
  }

  async createCompany(
    res: Response,
    createData: CreateCompanyDto,
    images: { avatar: Express.Multer.File; photos: Express.Multer.File[] },
  ) {
    try {
      const { egrpouCode, email, password, site, phone, about } = createData;
      const existingCompany = await this.companyRepository.findOne({
        where: {
          egrpouCode,
          email,
          site,
          phone,
        },
      });

      if (existingCompany) {
        let messages: string[] = [];
        if (phone === existingCompany?.phone) {
          messages.push('Цей номер вже зареєстрований');
        }
        if (site === existingCompany?.site) {
          messages.push('Ця адреса сайту вже зареєстрована');
        }
        if (email === existingCompany?.email) {
          messages.push('Ця пошта вже зареєстрована');
        }
        if (egrpouCode === existingCompany?.egrpouCode) {
          messages.push('Цей код ЄДРПОУ вже зареєстрована');
        }

        return HttpResponseHandler.error({
          res,
          message: messages,
          error: 'Unauthorized',
          statusCode: 401,
        });
      }

      let egrpouData = await this.egrpouService.addEGRPOU(res, egrpouCode);

      const hashPassword = await bcrypt.hash(password, 5);

      const activationLink = uuid.v4();

      const name = getNameFromEgrpou(egrpouData.name);

      const slug = generateSlug(name);

      const { avatar, photos } = images;

      // Сохранение аватара
      let avatarName: string = '';
      if (avatar) {
        try {
          avatarName = await ConvertToWebp.convertAvatar(res, avatar);
        } catch (error) {
          return HttpResponseHandler.error({
            res,
            message: error.message,
            error: error.name,
            statusCode: error.statusCode || 500,
          });
        }
      }

      // Сохранение изображений
      let photosName: string[] = [];
      if (images) {
        try {
          photosName = await ConvertToWebp.convertImages(photos);
        } catch (error) {
          return HttpResponseHandler.error({
            res,
            message: error.message,
            error: error.name,
            statusCode: error.statusCode || 500,
          });
        }
      }

      const createdUser = await this.companyRepository.save({
        slug,
        name,
        email,
        password: hashPassword,
        about,
        phone,
        site,
        avatar: avatarName,
        photos: photosName,
        egrpouCode,
        activationLink,
      });

      await this.egrpouRepository.save(egrpouData);

      await new MailService().sendActivationMail(
        email,
        this.configService.get<string>('API_URL') +
          'api/company/activate/' +
          activationLink,
      );
      const tokens = this.tokenService.generateTokens({
        role: createdUser.role,
        id: createdUser.id,
        slug,
        isActivated: createdUser.isActivated,
        isVerified: createdUser.isVerified,
      });

      await this.tokenService.saveToken(createdUser.id, tokens.refreshToken);

      return HttpResponseHandler.response({
        res,
        data: 'Успішно зареєстровано',
        statusCode: 201,
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

  async logout(res: Response, req: Request) {
    try {
      const refreshToken = req.cookies['refreshToken'];
    } catch (error) {
      return HttpResponseHandler.error({
        res,
        message: error.message,
        error: error.name,
        statusCode: error.statusCode || 500,
      });
    }
  }

  async activate(res: Response, activateLink: string) {
    try {
      const existingCompany = await this.companyRepository.findOne({
        where: { activationLink: activateLink },
      });

      if (!existingCompany) {
        return HttpResponseHandler.error({
          res,
          error: 'Forbidden',
          statusCode: 403,
          message: 'Компанія не знайдена ',
        });
      }

      existingCompany.isActivated = true;
      await this.companyRepository.save(existingCompany);

      return res.send(
        `
   <html>
    <head>
      <title>Account Activation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: #333;
        }
        .container {
          text-align: center;
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #4CAF50;
        }
        p {
          font-size: 16px;
          line-height: 1.5;
        }
        a {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        a:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Ваш акаунт активовано</h1>
        <p>Дякую за активацію акаунта.</p>
          <a href="${this.configService.get<string>('CLIENT_URL')!}">Перейти на головну</a>
      </div>
    </body>
  </html>
      `,
      );
    } catch (error) {
      return HttpResponseHandler.error({
        res,
        message: error.message,
        error: error.name,
        statusCode: error.statusCode || 500,
      });
    }
  }

  async getAllCompanies(
    res: Response,
    req: Request,
    query: { [k: string]: string },
  ) {
    try {
      const cookieToken = req.cookies['accessToken'];
      const userData = jwt.decode(cookieToken);
      const [allCompanies, count] = await this.companyRepository.findAndCount({
        select: [
          'slug',
          'name',
          'email',
          'about',
          'phone',
          'site',
          'isVerified',
          'avatar',
          'photos',
        ],
      });
      console.log(query);
      return res.json({ data: allCompanies, count });
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
