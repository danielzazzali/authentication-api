import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user/login-user.dto';
import { SignupUserDto } from './dto/signup-user/signup-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password/forgot-password.dto';
import { ValidateResetCodeDto } from './dto/validate-reset-code/validate-reset-code.dto';
import { ChangePasswordDto } from './dto/change-password/change-password.dto';
import { ChangePasswordResponseDto } from './dto/change-password-response/change-password-response.dto';
import { ValidateResetCodeResponseDto } from './dto/validate-reset-code-response/validate-reset-code-response.dto';
import { ForgotPasswordResponseDto } from './dto/forgot-password-response/forgot-password-response.dto';
import { AuthResponseDto } from './dto/auth-response/auth-response.dto';

/**
 * AuthController is a controller that handles authentication related routes.
 * @class
 */
@Controller('auth')
export class AuthController {
  /**
   * @constructor
   * @param {AuthService} authService - The authentication service.
   */
  constructor(private authService: AuthService) {}

  /**
   * Handles the login route.
   * @async
   * @param {LoginUserDto} loginUserDto - The login user data transfer object.
   * @returns {Promise} The result of the login operation.
   * @throws {HttpException} If the user is not found, credentials are invalid, or an error occurs during login.
   */
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    try {
      return await this.authService.login(loginUserDto);
    } catch (error) {
      if (error.message === `User with email ${loginUserDto.email} not found`) {
        throw new HttpException(
          `User with email ${loginUserDto.email} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else if (error.message === 'Invalid credentials') {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException(
          'Error logging in',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Handles the signup route.
   * @async
   * @param {SignupUserDto} signupUserDto - The signup user data transfer object.
   * @returns {Promise} The result of the signup operation.
   * @throws {HttpException} If the user already exists, or an error occurs during signup.
   */
  @Post('signup')
  async signup(@Body() signupUserDto: SignupUserDto): Promise<AuthResponseDto> {
    try {
      return await this.authService.signup(signupUserDto);
    } catch (error) {
      if (error.message === 'User with this email already exists') {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      } else if (error.message === 'User with this rut already exists') {
        throw new HttpException(
          'User with this rut already exists',
          HttpStatus.CONFLICT,
        );
      } else if (
        error.message === 'Error creating or saving user in repository'
      ) {
        throw new HttpException(
          'Error creating or saving user in repository',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'Error creating user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Handles the forgot-password route.
   * @async
   * @param {ForgotPasswordDto} forgotPasswordDto - The forgot password data transfer object.
   * @returns {Promise} The result of the forgot password operation.
   * @throws {HttpException} If the user is not found, or an error occurs during the forgot password process.
   */
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    try {
      return await this.authService.forgotPassword(forgotPasswordDto);
    } catch (error) {
      if (
        error.message === `User with email ${forgotPasswordDto.email} not found`
      ) {
        throw new HttpException(
          `User with email ${forgotPasswordDto.email} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else if (error.message === 'Failed to save forgot password record') {
        throw new HttpException(
          'Error processing forgot password request',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'Error processing forgot password request',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Handles the validate-reset-code route.
   * @async
   * @param {ValidateResetCodeDto} validateResetCodeDto - The validate reset code data transfer object.
   * @returns {Promise} The result of the validate reset code operation.
   * @throws {HttpException} If the user is not found, or an error occurs during the validate reset code process.
   */
  @Get('validate-reset-code')
  async validateResetCode(
    @Body() validateResetCodeDto: ValidateResetCodeDto,
  ): Promise<ValidateResetCodeResponseDto> {
    try {
      return await this.authService.validateResetCode(validateResetCodeDto);
    } catch (error) {
      if (
        error.message ===
        `User with email ${validateResetCodeDto.email} not found`
      ) {
        throw new HttpException(
          `User with email ${validateResetCodeDto.email} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          'Error validating recovery code',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Handles the change-password route.
   * @async
   * @param {ChangePasswordDto} changePasswordDto - The change password data transfer object.
   * @returns {Promise} The result of the change password operation.
   * @throws {HttpException} If the reset code is invalid, user is not found, passwords do not match,
   * or an error occurs during the change password process.
   */
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    try {
      return await this.authService.changePassword(changePasswordDto);
    } catch (error) {
      if (error.message === 'Invalid reset code') {
        throw new HttpException('Invalid reset code', HttpStatus.UNAUTHORIZED);
      } else if (
        error.message === `User with email ${changePasswordDto.email} not found`
      ) {
        throw new HttpException(
          `User with email ${changePasswordDto.email} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else if (error.message === 'Passwords do not match') {
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.message === 'Error saving user password') {
        throw new HttpException(
          'Error saving user password',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else if (error.message === 'Error saving forgot password record') {
        throw new HttpException(
          'Error saving forgot password record',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'Error changing password',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
