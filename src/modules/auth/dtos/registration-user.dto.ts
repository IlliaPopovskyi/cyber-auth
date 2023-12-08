import { User } from 'entities/user.entity';
import { CreateUserDto } from 'modules/user/dtos/create-user.dto';

export class RegistrationUserDto extends CreateUserDto {
  static responseRegistration(user: User) {
    const { password, ...response } = user;
    return response;
  }
}
