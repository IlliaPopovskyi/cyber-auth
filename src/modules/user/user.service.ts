import { Injectable } from '@nestjs/common';
import { User } from 'entities/user.entity';
import { CreateUserDto } from 'modules/user/dtos/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersManager: Repository<User>,
  ) {}

  createUser(data: CreateUserDto): Promise<User> {
    return this.usersManager.save({ ...data });
  }

  findOneByLogin(login: string): Promise<User | never> {
    return this.usersManager.findOne({ where: { login } });
  }
}
