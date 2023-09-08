import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findById(id: number): Promise<User | null> {
    return await this.userModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { email } });
  }

  async findByName(name: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { name } });
  }

  async findByParameter(key: string, value: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: {
        [key]: value,
      },
    });
  }

  async findAll() {
    return this.userModel.findAll();
  }

  async create(userDto: CreateUserDto): Promise<User> {
    return await this.userModel.create(userDto);
  }

  async update(id: number, userDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.name = userDto.name;
    user.email = userDto.email;
    await user.save();
    return user;
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.destroy();
  }
}
