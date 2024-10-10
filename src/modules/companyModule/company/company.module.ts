import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { EGRPOUModule } from 'src/modules/egrpouModule/egrpou.module';
import { EGRPOU } from 'src/modules/egrpouModule/egrpou.entity';
import { TokenModule } from 'src/modules/tokenModule/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, EGRPOU]),
    EGRPOUModule,
    TokenModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
