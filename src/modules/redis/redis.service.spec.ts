import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

const mockRedisClient = {
  set: jest.fn(),
  get: jest.fn(),
  quit: jest.fn(),
};

describe('RedisService', () => {
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(redisService).toBeDefined();
  });

  describe('onModuleDestroy', () => {
    it('should call quit method on redisClient during module destruction', async () => {
      await redisService.onModuleDestroy();
      expect(mockRedisClient.quit).toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('should call set method on redisClient with the correct parameters', async () => {
      const key = 'testKey';
      const value = 'testValue';
      const expirationSeconds = 60;
      await redisService.set(key, value, expirationSeconds);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        key,
        value,
        'EX',
        expirationSeconds,
      );
    });
  });

  describe('get', () => {
    it('should call get method on redisClient with the correct parameter', async () => {
      const key = 'testKey';
      await redisService.get(key);
      expect(mockRedisClient.get).toHaveBeenCalledWith(key);
    });

    it('should return the result from redisClient', async () => {
      const key = 'testKey';
      const expectedResult = 'testValue';
      mockRedisClient.get.mockResolvedValue(expectedResult);
      const result = await redisService.get(key);
      expect(result).toBe(expectedResult);
    });
  });
});
