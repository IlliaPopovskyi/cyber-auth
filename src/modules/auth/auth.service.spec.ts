import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from 'entities/user.entity';
import { UserService } from 'modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'modules/redis/redis.service';
import { CreateUserDto } from 'modules/user/dtos/create-user.dto';
import { IUserJwtPayload } from './interfaces/jwt-payload.interface';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const users: User[] = [
  {
    id: 1,
    login: 'testlogin1',
    password: 'hashed_testpassword1',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: 2,
    login: 'testlogin2',
    password: 'hashed_testpassword2',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: 3,
    login: 'testlogin3',
    password: 'hashed_testpassword3',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: 4,
    login: 'testlogin4',
    password: 'hashed_testpassword4',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: 5,
    login: 'testlogin5',
    password: 'hashed_testpassword5',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
];

const mockUserServiceFactory = () => ({
  createUser: jest
    .fn()
    .mockImplementation((data: CreateUserDto) =>
      users.find((user) => user.login === data.login),
    ),
  findOneByLogin: jest
    .fn()
    .mockImplementation((login: string) =>
      users.find((user) => user.login === login),
    ),
});

const mockJwtServiceFactory = () => ({
  signAsync: jest
    .fn()
    .mockImplementation(async (payload: IUserJwtPayload) => 'jwtToken'),
});

const redisMockValue = () => ({
  get: jest.fn().mockImplementation((userInRedisId: string) => {
    const id = Number(userInRedisId.split(':')[1]);
    return users.some((user) => user.id === id) ? 'existed' : undefined;
  }),
  set: jest.fn(),
});

const userEntityMockFactory = () => ({
  save: jest
    .fn()
    .mockImplementation((data: User) =>
      users.find((user) => user.login === data.login),
    ),
  findOne: jest
    .fn()
    .mockImplementation((data: { where: Record<string, any> }) =>
      users.find((user) => user.login === data.where.login),
    ),
});

jest.mock('bcryptjs', () => ({
  compare: jest
    .fn()
    .mockImplementation(
      async (data: string, hashedData: string) =>
        `hashed_${data}` === hashedData,
    ),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let redisService: RedisService;
  let userEntity: Repository<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useFactory: mockJwtServiceFactory },
        { provide: RedisService, useFactory: redisMockValue },
        { provide: UserService, useFactory: mockUserServiceFactory },
        {
          provide: getRepositoryToken(User),
          useFactory: userEntityMockFactory,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    redisService = module.get<RedisService>(RedisService);
    userEntity = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Login User', () => {
    it('should success login user', async () => {
      const { accessToken } = await authService.loginUser({
        login: 'testlogin1',
        password: 'testpassword1',
      });
      expect(accessToken).toBe('jwtToken');
    });

    it('should failed login user, wrong login', async () => {
      try {
        await authService.loginUser({
          login: 'testlogin12',
          password: 'testpassword1',
        });
      } catch (err) {
        expect(err.message).toBe('Incorrect login or password');
      }
    });

    it('should failed login user, wrong password', async () => {
      try {
        await authService.loginUser({
          login: 'testlogin1',
          password: 'testpassword1333',
        });
      } catch (err) {
        expect(err.message).toBe('Incorrect login or password');
      }
    });
  });

  describe('Registration user', () => {
    it('should registration user', async () => {
      const user = await authService.registrationUser({
        login: 'testlogin2',
        password: 'doesnt metter',
      });
      expect(user.login).toBe(users[1].login);
    });
  });

  describe('Authorized user', () => {
    it('should find user in cash(redis)', async () => {
      const isExisted = await authService.isUserAuthorized(2);
      expect(isExisted).toStrictEqual({ existed: true });
    });

    it('should not find user in cash(redis)', async () => {
      const isExisted = await authService.isUserAuthorized(55);
      expect(isExisted).toStrictEqual({ existed: false });
    });
  });
});
