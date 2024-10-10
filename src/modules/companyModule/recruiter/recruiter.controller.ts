import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { Response, Request } from 'express';
import { CompanyGuard } from 'src/guards/company.guards';
import { CreateRecruiterDTO } from './recruiter.dto';

@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @UseGuards(CompanyGuard)
  @Post('create')
  async createRecruiter(
    @Req() req: Request,
    @Res() res: Response,
    // @Body() createRecruiterData: CreateRecruiterDTO,
  ) {
    return this.recruiterService.createRecruiterService(
      req,
      res,
      //   createRecruiterData,
    );
  }
}
