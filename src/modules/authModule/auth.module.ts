import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companyModule/company/company.entity';
import { TokenModule } from '../tokenModule/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
  // exports: [AuthService],
})
export class AuthModule {}
