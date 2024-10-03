import { EGRPOU } from 'src/services/egrpou/egrpou.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'text' })
  about?: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  site: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  avatar: string;

  @Column({ type: 'jsonb' })
  photos?: string[];

  @Column({ type: 'varchar', unique: true, nullable: false })
  egrpouCode: string;

  // Связь с таблицей EDRPOU
  @OneToOne(() => EGRPOU, (egrpou) => egrpou.egrpou)
  egrpou: EGRPOU;
}
