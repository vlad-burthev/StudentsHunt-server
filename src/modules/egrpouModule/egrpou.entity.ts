import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('egrpou')
export class EGRPOU {
  @PrimaryColumn({ type: 'varchar', nullable: false, unique: true })
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
}
