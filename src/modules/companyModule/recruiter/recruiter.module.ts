import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from './recruiter.entity';
import { RecruiterController } from './recruiter.controller';
import { RecruiterService } from './recruiter.service';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { Company } from '../company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recruiter, Company])],
  controllers: [RecruiterController],
  providers: [RecruiterService, CloudinaryService],
})
export class RecruiterModule {}
