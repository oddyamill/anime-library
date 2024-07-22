import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Anime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  anilistId: number;

  @Column()
  malId: number;

  @Column()
  banner: string;
}
