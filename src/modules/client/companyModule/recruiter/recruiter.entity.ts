import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';
import { ERole } from 'src/interface';

@Entity('recruiter')
export class Recruiter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  slug: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: ERole,
    nullable: false,
    default: ERole.recruiter,
  })
  role: ERole;

  @Column({ type: 'varchar', unique: true, nullable: false })
  phone: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  avatar: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  activationLink: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isVerified: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  isActivated: boolean;

  @OneToOne(() => Company, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
