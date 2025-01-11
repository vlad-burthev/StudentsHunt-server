import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { Response, Request } from 'express';
import { CompanyGuard } from 'src/guards/company.guards';
import { CreateRecruiterDTO } from './recruiter.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @UseGuards(CompanyGuard)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('avatar', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  async createRecruiter(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() createRecruiterData: CreateRecruiterDTO,
  ) {
    return this.recruiterService.createRecruiterService(
      req,
      res,
      avatar,
      createRecruiterData,
    );
  }
}
