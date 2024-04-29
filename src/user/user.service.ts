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
   */
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('FORGOT_PASSWORD_REPOSITORY')
    private forgotPasswordRepository: Repository<ForgotPassword>,
    private notificationService: NotificationService,
  ) {}

  /**
   * Handles the signup operation.
   * @async
   * @param {SignupUserDto} signupUserDto - The signup user data transfer object.
   * @returns {Promise<Partial<User>>} The result of the signup operation.
   * @throws {Error} If the user already exists or an error occurs during signup.
   */
  async signup(signupUserDto: SignupUserDto): Promise<Partial<User>> {
    const email = signupUserDto.email;
    const rut = signupUserDto.rut;

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
        hashed_password: hashedPassword,
      });

      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new Error('Error creating or saving user in repository');
    }

    return {
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      rut: newUser.rut,
    };
  }

  /**
   * Handles the login operation.
   * @async
   * @param {LoginUserDto} loginUserDto - The login user data transfer object.
   * @returns {Promise<Partial<User>>} The result of the login operation.
   * @throws {Error} If the user is not found or the credentials are invalid.
   */
  async login(loginUserDto: LoginUserDto): Promise<Partial<User>> {
    const email = loginUserDto.email;
    const password = loginUserDto.password;

    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const passwordMatch = await bcrypt.compare(password, user.hashed_password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    return {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      rut: user.rut,
    };
  }

  /**
   * Handles the forgot password operation.
   * @async
   * @param {ForgotPasswordDto} forgotPasswordDto - The forgot password data transfer object.
   * @returns {Promise<{ success: boolean, message: string }>} The result of the forgot password operation.
   * @throws {Error} If the user is not found or an error occurs during the forgot password process.
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ success: boolean; message: string; }> {
    const email = forgotPasswordDto.email;

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

    return { success: true, message: 'Password reset requested successfully' };
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
  ): Promise<{ isValid: boolean }> {
    const email = validateResetCodeDto.email;
    const resetCode = validateResetCodeDto.code;

    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const forgotPasswordRecord = await this.forgotPasswordRepository
      .createQueryBuilder('forgot_password')
      .where('forgot_password.user = :user', { user: user.user_id })
      .andWhere('forgot_password.code = :code', { code: resetCode })
      .orderBy('forgot_password.createdAt', 'DESC')
      .getOne();

    if (!forgotPasswordRecord) {
      return { isValid: false };
    }

    const validUntil = forgotPasswordRecord.validUntil;
    const currentTime = new Date();

    if (currentTime <= validUntil) {
      return { isValid: true };
    }

    return { isValid: false };
  }
}
