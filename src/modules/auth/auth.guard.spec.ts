import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should allow access when a valid token is provided', async () => {
    const mockPayload = { sub: 'userId', username: 'testuser' };
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(mockPayload);

    const canActivate = await authGuard.canActivate({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer validToken',
          },
        }),
      }),
    } as any);

    expect(canActivate).toBe(true);
  });

  it('should throw UnauthorizedException when no token is provided', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockImplementationOnce(() => {
      throw new UnauthorizedException();
    });

    await expect(
      authGuard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as any),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when token is invalid', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockImplementationOnce(() => {
      throw new UnauthorizedException();
    });

    await expect(
      authGuard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer invalidToken',
            },
          }),
        }),
      } as any),
    ).rejects.toThrow(UnauthorizedException);
  });
});
