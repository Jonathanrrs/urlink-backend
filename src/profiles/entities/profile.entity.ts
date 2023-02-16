import { User } from '../../auth/entities/user.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  description: string;
  @Column('text', {
    nullable: true,
    array: true,
  })
  urls: object[];
  @Column('text', {
    nullable: true,
  })
  photo: string;

  //   @OneToOne(() => User, (user) => user.profile, { eager: true })
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
