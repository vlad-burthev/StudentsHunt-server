import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';
import { Recruiter } from '../recruiter/recruiter.entity';
import { WorkType } from 'src/modules/workType/workType.entity';

@Entity('vacancy')
export class Vacancy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  slug: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false, name: 'employment_type' })
  employmentType: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  state: boolean;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'int', nullable: false })
  salary: number;

  @Column({ type: 'boolean', nullable: false })
  test: boolean;

  @Column({ type: 'blob', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'blob', nullable: false })
  requirements: string[];

  @Column({ type: 'blob', nullable: false })
  conditions: string;

  @OneToOne(() => WorkType)
  @JoinColumn({ name: 'work_type_id' })
  workType: WorkType;

  @OneToOne(() => Recruiter, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'recruiter_id' })
  recruiter: Recruiter;

  @OneToOne(() => Company, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
