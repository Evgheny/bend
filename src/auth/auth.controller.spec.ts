import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UserRoles } from '../constants/user.roles';
import * as bcrypt from 'bcrypt';

describe('AuthController', () => {
  let authController: AuthController;

  const mockUserService = {
    create: jest.fn(),
  };

  const mockAuthService = {
    generateJwtToken: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('createUser', () => {
    it('should create a new user and return an access token', async () => {
      const createUserDto = new CreateUserDto();
      createUserDto.name = 'Test User';
      createUserDto.email = 'test@example.com';
      createUserDto.passwordHash = await bcrypt.hash('1234', 10);
      createUserDto.type = UserRoles.BLOGGER;

      mockUserService.create.mockResolvedValue(createUserDto); // Use mockResolvedValue for async functions
      mockAuthService.generateJwtToken.mockReturnValue('accessToken');

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await authController.createUser(response, '1234', {
        name: 'Test User',
        email: 'test@example.com',
      });

      expect(response.json).toHaveBeenCalledWith({
        accessToken: 'accessToken',
      });
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockAuthService.generateJwtToken).toHaveBeenCalledWith(
        createUserDto,
      );
    });

    it('should handle registration failure', async () => {
      mockUserService.create.mockImplementation(() => {
        throw new Error('Registration error');
      });

      const response = await authController.createUser(
        {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as any,
        '1234',
        {
          name: 'Test User',
          email: 'test@example.com',
        },
      );

      expect(response).toEqual({
        message: 'Registration failed',
        error: 'Registration error',
      });
    });
  });

  describe('loginUser', () => {
    it('should validate user and return an access token', async () => {
      mockAuthService.validateUser.mockReturnValue({}); // Replace {} with your mocked user data
      mockAuthService.generateJwtToken.mockReturnValue('accessToken');

      const response = await authController.loginUser(
        'password',
        'test@example.com',
      );

      expect(response).toEqual({ accessToken: 'accessToken' });
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        { key: 'email', value: 'test@example.com' },
        'password',
      );
      expect(mockAuthService.generateJwtToken).toHaveBeenCalledWith({});
    });

    it('should handle invalid credentials', async () => {
      mockAuthService.validateUser.mockReturnValue(null);

      const response = await authController.loginUser(
        'password',
        'test@example.com',
      );

      expect(response).toEqual({ message: 'Invalid credentials' });
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        { key: 'email', value: 'test@example.com' },
        'password',
      );
    });
  });
});
