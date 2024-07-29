import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Anime } from '../anime/anime.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Anime)
  @JoinColumn()
  anime: Anime;

  @Column({ unique: true })
  file: string;

  @Column('float')
  from: number;

  @Column('float')
  to: number;

  @Column()
  episode: number;
}
