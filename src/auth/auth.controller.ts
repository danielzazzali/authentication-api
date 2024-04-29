import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ValidateResetCodeDto } from './dto/validate-reset-code.dto';
import { User } from '../user/entities/user.entity';

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
  async login(@Body() loginUserDto: LoginUserDto): Promise<Partial<User>> {
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
  async signup(@Body() signupUserDto: SignupUserDto): Promise<Partial<User>> {
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
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ success: boolean, message: string }> {
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
  async validateResetCode(@Body() validateResetCodeDto: ValidateResetCodeDto): Promise<{isValid: boolean}> {
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
}
