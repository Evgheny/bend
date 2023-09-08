import 'reflect-metadata';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table({
  tableName: 'posts',
  indexes: [
    {
      fields: ['title', 'content'],
      unique: true,
    },
  ],
})
export class Post extends Model<Post> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false })
  content: string;

  @Column({ allowNull: false, defaultValue: false })
  isHidden: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
