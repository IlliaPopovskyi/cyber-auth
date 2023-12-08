import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from 'modules/user/user.service';
import { RegistrationUserDto } from './dtos/registration-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'modules/redis/redis.service';
import { rediUserKeyHelper } from 'common/helpers/redis-user-key.helper';
import { IUserJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async registrationUser(data: RegistrationUserDto) {
    const user = await this.userService.createUser(data);
    return RegistrationUserDto.responseRegistration(user);
  }

  async loginUser(data: LoginUserDto): Promise<{ accessToken: string }> {
    try {
      const user = await this.userService.findOneByLogin(data.login);
      if (!user) {
        throw new HttpException(
          'Incorrect login or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const isEqual = await compare(String(data.password), user.password);
      if (!isEqual) {
        throw new HttpException(
          'Incorrect login or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const jwtPayload: IUserJwtPayload = { id: user.id };
      const accessToken = await this.jwtService.signAsync(jwtPayload);
      await this.cacheUserAuth(user.id);
      return { accessToken };
    } catch (err) {
      return err;
    }
  }

  private async getUserAuthCache(id: number) {
    return this.redisService.get(rediUserKeyHelper(id));
  }

  private async cacheUserAuth(id: number) {
    await this.redisService.set(
      rediUserKeyHelper(id),
      'existed',
      24 * 60 * 60, // 24 hours
    );
  }

  async isUserAuthorized(id: number) {
    const data = await this.getUserAuthCache(id);
    return { existed: data === 'existed' };
  }
}
