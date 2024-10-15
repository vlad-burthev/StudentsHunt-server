import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './vacancy.entity';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy])],
  controllers: [VacancyController],
  providers: [VacancyService],
})
export class VacancyModule {}
