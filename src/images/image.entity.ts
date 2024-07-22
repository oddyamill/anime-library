import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Anime } from '../anime/anime.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Anime)
  anime: Anime;

  @Column({ unique: true })
  url: string;

  @Column('float')
  from: number;

  @Column('float')
  to: number;

  @Column()
  episode: number;
}
