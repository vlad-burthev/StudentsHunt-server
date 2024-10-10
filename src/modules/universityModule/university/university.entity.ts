import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('university')
export class University {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;
}
