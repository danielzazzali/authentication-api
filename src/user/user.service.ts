import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import '../config/config';
import { User } from './entities/user.entity';
import { ForgotPassword } from './entities/forgot-password.entity';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { SignupUserDto } from '../auth/dto/signup-user.dto';
import { ForgotPasswordDto } from '../auth/dto/forgot-password.dto';
import { NotificationService } from '../notification/notification.service';
import {
  RESTORE_PASSWORD_CODE_GENERATOR_LOWER_BOUND,
  RESTORE_PASSWORD_CODE_GENERATOR_MULTIPLIER,
  RESTORE_PASSWORD_CODE_SUBJECT_TEXT,
  RESTORE_PASSWORD_CODE_TEXT,
} from '../constants/constants';
import { ValidateResetCodeDto } from '../auth/dto/validate-reset-code.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { ForgotPasswordResponseDto } from '../auth/dto/forgot-password-response.dto';
import { ValidateResetCodeResponseDto } from '../auth/dto/validate-reset-code-response.dto';
import { ChangePasswordResponseDto } from '../auth/dto/change-password-response.dto';
import { AuthResponseDto } from '../auth/dto/auth-response.dto';
import { TokenService } from '../token/token.service';
import { PayloadJwt } from '../auth/dto/payload-jwt.dto';

/**
 * UserService is a service that handles user related operations.
 * @class
 */
@Injectable()
export class UserService {
  /**
   * @constructor
   * @param {Repository<User>} userRepository - The user repository.
   * @param {Repository<ForgotPassword>} forgotPasswordRepository - The forgot password repository.
   * @param {NotificationService} notificationService - The notification service.
   * @param tokenService - The token service.
   */
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('FORGOT_PASSWORD_REPOSITORY')
    private forgotPasswordRepository: Repository<ForgotPassword>,
    private notificationService: NotificationService,
    private tokenService: TokenService,
  ) {}

  /**
   * Handles the signup operation.
   * @async
   * @param {SignupUserDto} signupUserDto - The signup user data transfer object.
   * @returns {Promise<Partial<User>>} The result of the signup operation.
   * @throws {Error} If the user already exists or an error occurs during signup.
   */
  async signup(signupUserDto: SignupUserDto): Promise<AuthResponseDto> {
    const { email, rut } = signupUserDto;

    let existingUser = await this.userRepository.findOneBy({ email: email });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    if (rut) {
      existingUser = await this.userRepository.findOneBy({ rut: rut });

      if (existingUser) {
        throw new Error('User with this rut already exists');
      }
    }

    const password = signupUserDto.password;
    const passwordSalt = process.env.PASSWORD_SALT;
    const hashedPassword = await bcrypt.hash(password, passwordSalt);

    let newUser: User;

    try {
      newUser = this.userRepository.create({
        ...signupUserDto,
        hashedPassword: hashedPassword,
      });

      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new Error('Error creating or saving user in repository');
    }

    const payload = new PayloadJwt(
      newUser.email,
      newUser.firstName,
      newUser.lastName,
      newUser.rut,
    );

    const token = this.tokenService.encryptToken(payload);
    return new AuthResponseDto(token);
  }

  /**
   * Handles the login operation.
   * @async
   * @param {LoginUserDto} loginUserDto - The login user data transfer object.
   * @returns {Promise<Partial<User>>} The result of the login operation.
   * @throws {Error} If the user is not found or the credentials are invalid.
   */
  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = new PayloadJwt(
      user.email,
      user.firstName,
      user.lastName,
      user.rut,
    );

    const token = this.tokenService.encryptToken(payload);
    return new AuthResponseDto(token);
  }

  /**
   * Handles the forgot password operation.
   * @async
   * @param {ForgotPasswordDto} forgotPasswordDto - The forgot password data transfer object.
   * @returns {Promise<{ success: boolean, message: string }>} The result of the forgot password operation.
   * @throws {Error} If the user is not found or an error occurs during the forgot password process.
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const sixDigitsCode = Math.floor(
      RESTORE_PASSWORD_CODE_GENERATOR_LOWER_BOUND +
        Math.random() * RESTORE_PASSWORD_CODE_GENERATOR_MULTIPLIER,
    ).toString();

    try {
      const forgotPasswordRecord = this.forgotPasswordRepository.create({
        user: user,
        code: sixDigitsCode,
      });

      await this.forgotPasswordRepository.save(forgotPasswordRecord);
    } catch (error) {
      throw new Error('Failed to save forgot password record');
    }

    await this.notificationService.sendEmail(
      user.email,
      RESTORE_PASSWORD_CODE_SUBJECT_TEXT,
      RESTORE_PASSWORD_CODE_TEXT.replace('{code}', sixDigitsCode),
    );

    return new ForgotPasswordResponseDto(
      true,
      'Password reset requested successfully',
    );
  }

  /**
   * Handles the validate reset code operation.
   * @async
   * @param {ValidateResetCodeDto} validateResetCodeDto - The validate reset code data transfer object.
   * @returns {Promise<{ isValid: boolean }>} The result of the validate reset code operation.
   * @throws {Error} If the user is not found.
   */
  async validateResetCode(
    validateResetCodeDto: ValidateResetCodeDto,
  ): Promise<ValidateResetCodeResponseDto> {
    const { email, code } = validateResetCodeDto;

    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const forgotPasswordRecord = await this.forgotPasswordRepository
      .createQueryBuilder('forgot_password')
      .where('forgot_password.user = :user', { user: user.userId })
      .andWhere('forgot_password.code = :code', { code: code })
      .andWhere('forgot_password.isUsed = :isUsed', { isUsed: false })
      .orderBy('forgot_password.createdAt', 'DESC')
      .getOne();

    if (!forgotPasswordRecord) {
      return new ValidateResetCodeResponseDto(false);
    }

    const validUntil = forgotPasswordRecord.validUntil;
    const currentTime = new Date();

    if (currentTime <= validUntil) {
      return new ValidateResetCodeResponseDto(true);
    }

    return new ValidateResetCodeResponseDto(false);
  }

  /**
   * Handles the validate reset code operation.
   * @async
   * @param {ChangePasswordDto} changePasswordDto - The change password data transfer object.
   * @returns {Promise<{ isValid: boolean }>} The result of the validate reset code operation.
   * @throws {Error} If the user is not found, passwords do not match, or an error occurs during the change password process.
   */
  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    const { email, code, password, passwordConfirmation } = changePasswordDto;

    const validation = await this.validateResetCode({ email, code });
    if (!validation.isValid) {
      throw new Error('Invalid reset code');
    }

    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    if (password !== passwordConfirmation) {
      throw new Error('Passwords do not match');
    }

    const passwordSalt = process.env.PASSWORD_SALT;
    user.hashedPassword = await bcrypt.hash(password, passwordSalt);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new Error('Error saving user password');
    }

    try {
      const forgotPasswordRecord = await this.forgotPasswordRepository
        .createQueryBuilder('forgot_password')
        .where('forgot_password.user = :user', { user: user.userId })
        .andWhere('forgot_password.code = :code', { code: code })
        .orderBy('forgot_password.createdAt', 'DESC')
        .getOne();

      if (forgotPasswordRecord) {
        forgotPasswordRecord.isUsed = true;
        await this.forgotPasswordRepository.save(forgotPasswordRecord);
      }
    } catch (error) {
      throw new Error('Error saving forgot password record');
    }

    return new ChangePasswordResponseDto(true, 'Password changed successfully');
  }
}
