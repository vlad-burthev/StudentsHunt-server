import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recruiter } from '../recruiter/recruiter.entity';
import { Company } from '../company/company.entity';
import { Student } from '../../studentModule/student/student.entity';

@Entity({ name: 'job_application' })
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', nullable: true, default: null })
  state: null | boolean;

  @OneToOne(() => Recruiter, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'recruiter_id' })
  recruiter: Recruiter;

  @OneToOne(() => Company, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToOne(() => Student, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
