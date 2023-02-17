import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';

@Entity() /* this is to create table on postgres */
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  name: string;
  @Column('text')
  lastName: string;
  @Column('text', { unique: true })
  email: string;
  /* remember - maybe this could be select false */
  @Column('text', { select: false })
  password: string;
  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
}
