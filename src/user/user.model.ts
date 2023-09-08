import 'reflect-metadata';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { UserRoles } from '../constants/user.roles';
import { Post } from '../post/post.model';

const roles: string[] = Object.keys(UserRoles);

@Table({
  tableName: 'users',
  indexes: [
    {
      fields: ['email'],
      unique: true,
    },
  ],
})
export class User extends Model<User> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
    defaultValue: UserRoles.BLOGGER,
  })
  type: UserRoles;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  passwordHash: string;

  @HasMany(() => Post)
  posts: Post[];

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
