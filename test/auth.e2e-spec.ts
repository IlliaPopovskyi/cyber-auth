import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { AuthController } from 'modules/auth/auth.controller';
import { AuthService } from 'modules/auth/auth.service';
import { IUserJwtPayload } from 'modules/auth/interfaces/jwt-payload.interface';
import { RedisService } from 'modules/redis/redis.service';
import { CreateUserDto } from 'modules/user/dtos/create-user.dto';
import { UserService } from 'modules/user/user.service';
import * as request from 'supertest';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

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

const mockJwtServiceFactory = () => ({
  signAsync: jest
    .fn()
    .mockImplementation((payload: IUserJwtPayload) => String(payload.id)),
  verifyAsync: jest.fn().mockImplementation((token) => {
    return { id: Number(token) };
  }),
});

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const dataAuth = { login: 'testlogin5', password: 'testpassword5' };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        { provide: JwtService, useFactory: mockJwtServiceFactory },
        { provide: RedisService, useFactory: redisMockValue },
        { provide: UserService, useFactory: mockUserServiceFactory },
        {
          provide: getRepositoryToken(User),
          useFactory: userEntityMockFactory,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/auth/registration (POST)', async () => {
    try {
      const response = await request(app.getHttpServer())
        .post('/registration')
        .send(dataAuth)
        .expect(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.login).toEqual(dataAuth.login);
    } catch (err) {
      console.log(err);
    }
  });

  it('/api/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/login')
      .send(dataAuth)
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
  });

  it('/api/auth/is-authorized (GET)', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/login')
      .send(dataAuth)
      .expect(201);

    const authToken = loginResponse.body.accessToken;

    const response = await request(app.getHttpServer())
      .get('/is-authorized')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toEqual({ existed: true });
  });
});
