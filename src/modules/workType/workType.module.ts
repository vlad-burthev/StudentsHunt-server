import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkType } from './workType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkType])],
})
export class WorkTypeModule {}
