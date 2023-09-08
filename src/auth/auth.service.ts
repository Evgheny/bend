import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    parameter: { key: string; value: string },
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.findByParameter(
      parameter.key,
      parameter.value,
    );
    if (user) {
      const validPassword = await this.verifyPassword(
        password,
        user.passwordHash,
      );

      if (user && validPassword) {
        return user;
      }
    }

    return;
  }

  generateJwtToken(user: any) {
    const payload = { id: user.id, role: user.type };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1m',
    });
  }

  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { id: user.id, role: user.type };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  private async verifyPassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, passwordHash);
    return isMatch;
  }

  decodeJwtToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // Handle token verification errors (e.g., expired token, invalid token)
      return null;
    }
  }
}
