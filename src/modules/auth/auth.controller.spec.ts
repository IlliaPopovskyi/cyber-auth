import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegistrationUserDto } from './dtos/registration-user.dto';
import { JwtModule } from '@nestjs/jwt';
import { IRequestWithUserJwtPayload } from './interfaces/jwt-payload.interface';

const mockAuthService = {
  registrationUser: jest.fn(),
  loginUser: jest.fn(),
  isUserAuthorized: jest.fn(),
  getUserAuthCache: jest.fn(),
  cacheUserAuth: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [JwtModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should login user', async () => {
    await authController.loginUser({} as LoginUserDto);
    expect(authService.loginUser).toHaveBeenCalled();
  });

  it('should registration user', async () => {
    await authController.registrationUser({} as RegistrationUserDto);
    expect(authService.registrationUser).toHaveBeenCalled();
  });

  it('should is authorized user', async () => {
    await authController.isAuthorized({
      user: { id: 1 },
    } as IRequestWithUserJwtPayload);
    expect(authService.isUserAuthorized).toHaveBeenCalled();
  });
});
