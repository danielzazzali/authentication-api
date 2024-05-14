import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user/login-user.dto';
import { SignupUserDto } from './dto/signup-user/signup-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password/forgot-password.dto';
import { ValidateResetCodeDto } from './dto/validate-reset-code/validate-reset-code.dto';
import { ChangePasswordDto } from './dto/change-password/change-password.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthResponseDto } from './dto/auth-response/auth-response.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({}),
            signup: jest.fn().mockResolvedValue({}),
            forgotPassword: jest.fn().mockResolvedValue({}),
            validateResetCode: jest.fn().mockResolvedValue({}),
            changePassword: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call authService.login on login', async () => {
    const dto = new LoginUserDto('a@a.com', 'password');
    await authController.login(dto);
    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  it('should call authService.signup on signup', async () => {
    const dto = new SignupUserDto();
    await authController.signup(dto);
    expect(authService.signup).toHaveBeenCalledWith(dto);
  });

  it('should call authService.forgotPassword on forgotPassword', async () => {
    const dto = new ForgotPasswordDto();
    await authController.forgotPassword(dto);
    expect(authService.forgotPassword).toHaveBeenCalledWith(dto);
  });

  it('should call authService.validateResetCode on validateResetCode', async () => {
    const dto = new ValidateResetCodeDto();
    await authController.validateResetCode(dto);
    expect(authService.validateResetCode).toHaveBeenCalledWith(dto);
  });

  it('should call authService.changePassword on changePassword', async () => {
    const dto = new ChangePasswordDto();
    await authController.changePassword(dto);
    expect(authService.changePassword).toHaveBeenCalledWith(dto);
  });

  it('should throw an error when authService.login fails', async () => {
    const dto = new LoginUserDto('a@a.com', 'password');
    const error = new Error('Error message');
    jest.spyOn(authService, 'login').mockRejectedValueOnce(error);

    try {
      await authController.login(dto);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.message).toStrictEqual('Error logging in');
    }
  });

  it('should throw an error when authService.signup fails', async () => {
    const dto = new SignupUserDto();
    const error = new Error('User with this email already exists');
    jest.spyOn(authService, 'signup').mockRejectedValueOnce(error);

    try {
      await authController.signup(dto);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.message).toBe('User with this email already exists');
    }
  });

  it('should throw an error when authService.forgotPassword fails', async () => {
    const dto = new ForgotPasswordDto();
    const error = new Error(`User with email ${dto.email} not found`);
    jest.spyOn(authService, 'forgotPassword').mockRejectedValueOnce(error);

    try {
      await authController.forgotPassword(dto);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.message).toBe(`User with email ${dto.email} not found`);
    }
  });

  it('should throw an error when authService.validateResetCode fails', async () => {
    const dto = new ValidateResetCodeDto();
    const error = new Error(`User with email ${dto.email} not found`);
    jest.spyOn(authService, 'validateResetCode').mockRejectedValueOnce(error);

    try {
      await authController.validateResetCode(dto);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.message).toBe(`User with email ${dto.email} not found`);
    }
  });

  it('should throw an error when authService.changePassword fails', async () => {
    const dto = new ChangePasswordDto();
    const error = new Error('Invalid reset code');
    jest.spyOn(authService, 'changePassword').mockRejectedValueOnce(error);

    try {
      await authController.changePassword(dto);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.message).toBe('Invalid reset code');
    }
  });

  it('should return a response when authService.login is successful', async () => {
    const dto = new LoginUserDto('a@a.com', 'password');
    const response = new AuthResponseDto('token');
    jest.spyOn(authService, 'login').mockResolvedValueOnce(response);

    const result = await authController.login(dto);
    expect(result).toBe(response);
  });

  it('should throw an error when authService.login throws an HttpException', async () => {
    const dto = new LoginUserDto('a@a.com', 'password');
    const error = new HttpException(
      'Error message',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    jest.spyOn(authService, 'login').mockRejectedValueOnce(error);

    try {
      await authController.login(dto);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.message).toStrictEqual('Error logging in');
      expect(e.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });
});
