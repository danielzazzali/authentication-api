import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from '../user/user.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ValidateResetCodeDto } from './dto/validate-reset-code.dto';
import { User } from '../user/entities/user.entity';

/**
 * AuthService is a service that handles authentication related operations.
 * @class
 */
@Injectable()
export class AuthService {
  /**
   * @constructor
   * @param {UserService} userService - The user service.
   */
  constructor(private userService: UserService) {}

  /**
   * Handles the login operation.
   * @async
   * @param {LoginUserDto} loginUserDto - The login user data transfer object.
   * @returns {Promise} The result of the login operation.
   */
  async login(loginUserDto: LoginUserDto): Promise<Partial<User>> {
    return await this.userService.login(loginUserDto);
  }

  /**
   * Handles the signup operation.
   * @async
   * @param {SignupUserDto} signupUserDto - The signup user data transfer object.
   * @returns {Promise} The result of the signup operation.
   */
  async signup(signupUserDto: SignupUserDto): Promise<Partial<User>> {
    return await this.userService.signup(signupUserDto);
  }

  /**
   * Handles the forgot password operation.
   * @async
   * @param {ForgotPasswordDto} forgotPasswordDto - The forgot password data transfer object.
   * @returns {Promise} The result of the forgot password operation.
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{success: boolean, message: string}> {
    return await this.userService.forgotPassword(forgotPasswordDto);
  }

  /**
   * Handles the validate reset code operation.
   * @async
   * @param {ValidateResetCodeDto} validateResetCodeDto - The validate reset code data transfer object.
   * @returns {Promise} The result of the validate reset code operation.
   */
  async validateResetCode(validateResetCodeDto: ValidateResetCodeDto): Promise<{isValid: boolean}> {
    return await this.userService.validateResetCode(validateResetCodeDto);
  }
}
