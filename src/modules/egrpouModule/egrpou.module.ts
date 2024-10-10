import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EgrpouService } from './egrpou.service';
import { EGRPOU } from './egrpou.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EGRPOU])],
  providers: [EgrpouService],
  exports: [EgrpouService],
})
export class EGRPOUModule {}
