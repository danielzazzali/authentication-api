import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user/login-user.dto';
import { SignupUserDto } from './dto/signup-user/signup-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password/forgot-password.dto';
import { ValidateResetCodeDto } from './dto/validate-reset-code/validate-reset-code.dto';
import { ChangePasswordDto } from './dto/change-password/change-password.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
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

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should call userService.login on login', async () => {
    const dto = new LoginUserDto('a@a.com', 'password');
    await authService.login(dto);
    expect(userService.login).toHaveBeenCalledWith(dto);
  });

  it('should call userService.signup on signup', async () => {
    const dto = new SignupUserDto();
    await authService.signup(dto);
    expect(userService.signup).toHaveBeenCalledWith(dto);
  });

  it('should call userService.forgotPassword on forgotPassword', async () => {
    const dto = new ForgotPasswordDto();
    await authService.forgotPassword(dto);
    expect(userService.forgotPassword).toHaveBeenCalledWith(dto);
  });

  it('should call userService.validateResetCode on validateResetCode', async () => {
    const dto = new ValidateResetCodeDto();
    await authService.validateResetCode(dto);
    expect(userService.validateResetCode).toHaveBeenCalledWith(dto);
  });

  it('should call userService.changePassword on changePassword', async () => {
    const dto = new ChangePasswordDto();
    await authService.changePassword(dto);
    expect(userService.changePassword).toHaveBeenCalledWith(dto);
  });
});