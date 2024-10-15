import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'work_type' })
export class WorkType {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;
}
