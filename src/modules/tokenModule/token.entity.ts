import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { University } from '../universityModule/university/university.entity';
import { Company } from '../companyModule/company/company.entity';

@Entity()
export class Token {
  @PrimaryColumn({ type: 'varchar', unique: true, nullable: false })
  userId: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  refreshToken: string;
}
