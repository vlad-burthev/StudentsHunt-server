import { ERole } from 'src/interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  slug: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({
    type: 'enum',
    enum: ERole,
    nullable: false,
    default: ERole.company,
  })
  role: ERole;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'text', nullable: false })
  about?: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  phone: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  site: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  avatar: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  egrpouCode: string;

  @Column({ type: 'jsonb' })
  photos?: string[];

  @Column({ type: 'boolean', default: false, nullable: false })
  isActivated: boolean;

  @Column({ type: 'varchar', unique: true, nullable: false })
  activationLink: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isVerified: boolean;
}
