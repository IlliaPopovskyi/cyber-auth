import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from 'entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

const users: User[] = [
  {
    id: 1,
    login: 'testlogin1',
    password: 'testpassword1',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
];

const mockRepository = {
  save: jest.fn().mockImplementation((data: CreateUserDto) => ({
    ...data,
    id: 2,
  })),
  findOne: jest
    .fn()
    .mockImplementation((data: { where: { login: string } }) =>
      users.find((user) => user.login === data.where.login),
    ),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const userData: CreateUserDto = {
        login: 'newuser',
        password: 'newpassword',
      };

      const result = await userService.createUser(userData);

      expect(result).toEqual({ ...userData, id: expect.any(Number) });
      expect(mockRepository.save).toHaveBeenCalledWith(userData);
    });
  });

  describe('findOneByLogin', () => {
    it('should find a user by login', async () => {
      const login = 'testlogin1';

      const result = await userService.findOneByLogin(login);

      expect(result).toEqual(users[0]);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { login },
      });
    });
  });
});
