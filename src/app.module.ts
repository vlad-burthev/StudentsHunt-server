import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/dotenvConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './modules/companyModule/company/company.module';
import { Company } from './modules/companyModule/company/company.entity';
import { EGRPOU } from './modules/egrpouModule/egrpou.entity';
import { University } from './modules/universityModule/university/university.entity';
import { Token } from './modules/tokenModule/token.entity';
import { TokenModule } from './modules/tokenModule/token.module';
import { EGRPOUModule } from './modules/egrpouModule/egrpou.module';
import { AuthModule } from './modules/authModule/auth.module';
import { Recruiter } from './modules/companyModule/recruiter/recruiter.entity';
import { RecruiterModule } from './modules/companyModule/recruiter/recruiter.module';
import { WorkType } from './modules/workType/workType.entity';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: true,
        entities: [Company, EGRPOU, University, Token, Recruiter],
      }),
    }),
    EGRPOUModule,
    CompanyModule,
    TokenModule,
    AuthModule,
    RecruiterModule,
    WorkType,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
