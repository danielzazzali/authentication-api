import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      return await this.authService.login(loginUserDto);
    } catch (error) {
      if (error.message === `User with email ${loginUserDto.email} not found`) {
        throw new HttpException(
          `User with email ${loginUserDto.email} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else if (error.message === 'Invalid password') {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException(
          'Error logging in',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.create(createUserDto);
    } catch (error) {
      if (error.message === 'User with this email or rut already exists') {
        throw new HttpException(
          'User with this email or rut already exists',
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          'Error creating user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
