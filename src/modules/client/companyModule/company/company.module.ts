import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { TokenModule } from 'src/modules/tokenModule/token.module';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { EGRPOU } from '../../egrpouModule/egrpou.entity';
import { EGRPOUModule } from '../../egrpouModule/egrpou.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, EGRPOU]),
    EGRPOUModule,
    TokenModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CloudinaryService],
})
export class CompanyModule {}
