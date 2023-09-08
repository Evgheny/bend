import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoles } from '../../constants/user.roles';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(UserRoles)
  type: UserRoles;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsBoolean()
  passwordHash: string;
}
