import { Entity, Column, BaseEntity, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './User';
import { Post } from './Post';

@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: 'int' })
  value: 1 | -1 | 0;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => User, (user) => user.updoots)
  user: string;

  @PrimaryColumn({ type: 'int', default: 0 })
  postId: number;

  @ManyToOne(() => Post, (post) => post.updoots)
  post: Post;
}
