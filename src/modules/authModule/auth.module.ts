import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../tokenModule/token.module';
import { GoogleStrategy } from 'src/services/google/google.stategy';
import { Recruiter } from '../client/companyModule/recruiter/recruiter.entity';
import { Company } from '../client/companyModule/company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Recruiter]), TokenModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  // exports: [AuthService],
})
export class AuthModule {}
