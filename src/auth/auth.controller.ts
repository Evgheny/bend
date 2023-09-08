import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UserRoles } from '../constants/user.roles';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(
    @Res() res: Response,
    @Body('password') password: string,
    @Body('data') data: { name: string; email: string },
  ) {
    try {
      console.log('password', password);
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('hashed Password in controller', hashedPassword);
      const userDto = new CreateUserDto();
      userDto.name = data.name;
      userDto.email = data.email;
      userDto.passwordHash = hashedPassword;
      userDto.type = UserRoles.BLOGGER;
      const result = await this.userService.create(userDto);
      const accessToken = this.authService.generateJwtToken(result);

      return res.status(201).json({ accessToken });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Registration failed',
        error: 'Registration error',
      });
    }
  }

  @Post('/login')
  async loginUser(
    @Body('password') password: string,
    @Body('data') data: string,
  ) {
    if (!data) {
      throw new HttpException(
        'No needed parameters provided',
        HttpStatus.FORBIDDEN,
      );
    }
    const specialChars = /[@]/;
    const res = specialChars.test(data);
    let parameter: { key: string; value: string };
    if (res) {
      parameter = { key: 'email', value: data };
    } else {
      parameter = { key: 'name', value: data };
    }
    const user = await this.authService.validateUser(parameter, password);

    if (!user) {
      return { message: 'Invalid credentials' };
    }

    const token = this.authService.generateJwtToken(user);

    return { accessToken: token };
  }
}
