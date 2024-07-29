import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Image } from '../images/image.entity';

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

  @OneToMany(() => Image, (image) => image.anime)
  images: Image[];
}
