import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateRecruiterDTO } from './recruiter.dto';
import { HttpResponseHandler } from 'src/services/response/HttpResponseHandler';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { EResourceType, ITokenUserData } from 'src/interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recruiter } from './recruiter.entity';
import { generateSlug } from 'src/common/generateSlug';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { Company } from '../company/company.entity';
import { MailService } from 'src/services/mail/mailService';
import * as uuid from 'uuid';

@Injectable()
export class RecruiterService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createRecruiterService(
    req: Request,
    res: Response,
    avatar: Express.Multer.File,
    createData: CreateRecruiterDTO,
  ) {
    try {
      const accessToken = req.cookies['accessToken'];

      const decodeToken = jwt.verify(
        accessToken,
        this.configService.get<string>('JWT_SECRET_KEY'),
      ) as ITokenUserData;

      const slug = generateSlug(createData.name);

      const existingRecruite = await this.recruiterRepository.find({
        where: {
          email: createData.email,
          name: createData.name,
          phone: createData.phone,
        },
      });

      if (existingRecruite) {
        return HttpResponseHandler.error({
          res,
          message: 'Такий коистувач вже існує',
          error: 'Forbidden',
          statusCode: 403,
        });
      }

      let avatarUrl: string = '';
      if (avatar) {
        try {
          const uploadResult = await this.cloudinaryService.uploadImage(
            avatar,
            this.configService.get<string>('CLOUDINARY_DIR_RECRUITER'),
            EResourceType.image,
          );
          avatarUrl = this.cloudinaryService.getOptimizedImageUrl(
            uploadResult.public_id,
          );
        } catch (error) {
          return HttpResponseHandler.error({
            res,
            message: 'Ошибка при загрузке аватара',
            error: error.message,
            statusCode: 500,
          });
        }
      }

      const company = await this.companyRepository.findOne({
        where: { id: decodeToken.id },
      });
      if (!company) {
        return HttpResponseHandler.error({
          res,
          message: 'Компания не найдена',
          statusCode: 404,
          error: 'Not Fount',
        });
      }

      // Генерация ссылки активации
      const activationLink = uuid.v4();

      await this.recruiterRepository.save({
        slug,
        name: createData.name,
        email: createData.email,
        password: createData.password,
        phone: createData.phone,
        company,
        avatar: avatarUrl,
      });

      // Отправка письма активации
      await new MailService().sendActivationMail(
        createData.email,
        `${this.configService.get<string>('API_URL')}/api/company/activate/${activationLink}`,
      );

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

  async createVacancy(req: Request, res: Response) {
    try {
      const token = req.cookies['accessToken'];
      const recruiterData = jwt.verify(
        token,
        this.configService.get<string>('JWT_SECRET_KEY'),
      );

      return HttpResponseHandler.response({
        res,
        data: 'Vacancy created',
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
}
