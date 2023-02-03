import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column('text')
  password: string;
  @Column('text', {
    nullable: true,
  })
  photo: string;
}
