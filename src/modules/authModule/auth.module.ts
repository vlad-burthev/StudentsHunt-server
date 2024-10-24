import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companyModule/company/company.entity';
import { TokenModule } from '../tokenModule/token.module';
import { Recruiter } from '../companyModule/recruiter/recruiter.entity';
import { GoogleStrategy } from 'src/services/google/google.stategy';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Recruiter]), TokenModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  // exports: [AuthService],
})
export class AuthModule {}
