import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthService } from './auth.service';
import { RegistrationUserDto } from './dtos/registration-user.dto';
import { AuthGuard } from './auth.guard';
import { IRequestWithUserJwtPayload } from './interfaces/jwt-payload.interface';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/registration')
  registrationUser(@Body() data: RegistrationUserDto) {
    return this.authService.registrationUser(data);
  }

  @Post('/login')
  loginUser(@Body() data: LoginUserDto) {
    return this.authService.loginUser(data);
  }

  @UseGuards(AuthGuard)
  @Get('/is-authorized')
  isAuthorized(@Request() request: IRequestWithUserJwtPayload) {
    return this.authService.isUserAuthorized(request.user.id);
  }
}
