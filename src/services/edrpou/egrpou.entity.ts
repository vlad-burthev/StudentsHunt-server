import { Company } from 'src/modules/companyModule/company/company.entity';
import { University } from 'src/modules/universityModule/university/university.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('egrpou')
export class EGRPOU {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  egrpou: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name_short: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  address: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  director: string;

  @Column({ type: 'varchar', nullable: true })
  kved: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  inn: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  inn_date?: string;

  // Тип связанной сущности (company или university)
  @Column({ type: 'varchar', nullable: false })
  entityType: 'company' | 'university'; // Указывает, с какой сущностью связано

  // Связь с Company, с каскадным удалением
  @OneToOne(() => Company, (company) => company.egrpou, { onDelete: 'CASCADE' })
  @JoinColumn() // Указывает, что это поле будет хранить внешний ключ
  company?: Company;

  // Связь с Company, с каскадным удалением
  @OneToOne(() => University, (company) => company.egrpou, {
    onDelete: 'CASCADE',
  })
  @JoinColumn() // Указывает, что это поле будет хранить внешний ключ
  university?: University;
}
