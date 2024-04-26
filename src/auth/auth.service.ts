import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginUserDto: LoginUserDto) {
    return await this.userService.findByEmail(loginUserDto);
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
