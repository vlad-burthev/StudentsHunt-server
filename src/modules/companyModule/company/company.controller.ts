import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './company.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'photos', maxCount: 10 },
      ],
      { limits: { fileSize: 5 * 1024 * 1024 } },
    ),
  )
  createCompany(
    @Res() res: Response,
    @UploadedFiles()
    images: { avatar: Express.Multer.File; photos: Express.Multer.File[] },
    @Body() createData: CreateCompanyDto,
  ) {
    return this.companyService.createCompany(res, createData, images);
  }

  @Get('/activate/:link')
  activateAccoun(@Res() res: Response, @Param('link') activateLink: string) {
    return this.companyService.activate(res, activateLink);
  }

  @Get('/refresh')
  refreshToken() {}

  @Get('/get_all')
  getAllCompanies(
    @Res() res: Response,
    @Req() req: Request,
    @Query() query: { [k: string]: string },
  ) {
    return this.companyService.getAllCompanies(res, req, query);
  }

  @Get('/getOne')
  getTest(@Res() res: Response) {
    return this.companyService.getCompany(res);
  }
}
