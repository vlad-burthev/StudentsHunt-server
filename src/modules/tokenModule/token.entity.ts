import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Token {
  @PrimaryColumn({ type: 'varchar', unique: true, nullable: false })
  userId: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  refreshToken: string;
}
