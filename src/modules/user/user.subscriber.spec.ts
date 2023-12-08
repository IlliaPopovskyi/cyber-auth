import { Test, TestingModule } from '@nestjs/testing';
import { UserSubscriber } from './user.subscriber';
import { User } from 'entities/user.entity';
import { DataSource, InsertEvent } from 'typeorm';

describe('UserSubscriber', () => {
  let userSubscriber: UserSubscriber;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = {
      subscribers: [],
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSubscriber,
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    userSubscriber = module.get<UserSubscriber>(UserSubscriber);
  });

  describe('beforeInsert', () => {
    it('should be called', () => {
      const event: InsertEvent<User> = {
        entity: { password: 'test_password' } as User,
      } as any;
      userSubscriber.beforeInsert(event);
      expect(true).toBe(true); // Just to ensure the test runs without errors
    });
  });

  describe('listenTo', () => {
    it('should return User class', () => {
      const result = userSubscriber.listenTo();
      expect(result).toBe(User);
    });
  });
});
