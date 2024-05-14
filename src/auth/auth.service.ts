import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user/login-user.dto';
import { UserService } from '../user/user.service';
import { SignupUserDto } from './dto/signup-user/signup-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password/forgot-password.dto';
import { ValidateResetCodeDto } from './dto/validate-reset-code/validate-reset-code.dto';
import { ChangePasswordDto } from './dto/change-password/change-password.dto';
import { ChangePasswordResponseDto } from './dto/change-password-response/change-password-response.dto';
import { ValidateResetCodeResponseDto } from './dto/validate-reset-code-response/validate-reset-code-response.dto';
import { ForgotPasswordResponseDto } from './dto/forgot-password-response/forgot-password-response.dto';
import { AuthResponseDto } from './dto/auth-response/auth-response.dto';

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
  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    return await this.userService.login(loginUserDto);
  }

  /**
   * Handles the signup operation.
   * @async
   * @param {SignupUserDto} signupUserDto - The signup user data transfer object.
   * @returns {Promise} The result of the signup operation.
   */
  async signup(signupUserDto: SignupUserDto): Promise<AuthResponseDto> {
    return await this.userService.signup(signupUserDto);
  }

  /**
   * Handles the forgot password operation.
   * @async
   * @param {ForgotPasswordDto} forgotPasswordDto - The forgot password data transfer object.
   * @returns {Promise} The result of the forgot password operation.
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    return await this.userService.forgotPassword(forgotPasswordDto);
  }

  /**
   * Handles the validate reset code operation.
   * @async
   * @param {ValidateResetCodeDto} validateResetCodeDto - The validate reset code data transfer object.
   * @returns {Promise} The result of the validate reset code operation.
   */
  async validateResetCode(
    validateResetCodeDto: ValidateResetCodeDto,
  ): Promise<ValidateResetCodeResponseDto> {
    return await this.userService.validateResetCode(validateResetCodeDto);
  }

  /**
   * Handles the change password operation.
   * @async
   * @param {ChangePasswordDto} changePasswordDto - The change password data transfer object.
   * @returns {Promise} The result of the change password operation.
   */
  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    return await this.userService.changePassword(changePasswordDto);
  }
}
