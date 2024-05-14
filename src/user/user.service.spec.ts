import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ForgotPassword } from './entities/forgot-password.entity';
import { NotificationService } from '../notification/notification.service';
import { TokenService } from '../token/token.service';
import { SignupUserDto } from '../auth/dto/signup-user/signup-user.dto';
import { ForgotPasswordDto } from '../auth/dto/forgot-password/forgot-password.dto';
import { ValidateResetCodeDto } from '../auth/dto/validate-reset-code/validate-reset-code.dto';
import { ChangePasswordDto } from '../auth/dto/change-password/change-password.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let forgotPasswordRepository: Repository<ForgotPassword>;
  let notificationService: NotificationService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            findOneBy: jest.fn().mockResolvedValue({}),
            create: jest.fn().mockReturnValue({}),
            save: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: 'FORGOT_PASSWORD_REPOSITORY',
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue({}),
            })),
            create: jest.fn().mockReturnValue({}),
            save: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            sendEmail: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: TokenService,
          useValue: {
            encryptToken: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>('USER_REPOSITORY');
    forgotPasswordRepository = module.get<Repository<ForgotPassword>>(
      'FORGOT_PASSWORD_REPOSITORY',
    );
    notificationService = module.get<NotificationService>(NotificationService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should call userRepository.findOneBy, forgotPasswordRepository.create, forgotPasswordRepository.save, and notificationService.sendEmail on forgotPassword', async () => {
    const dto = new ForgotPasswordDto();
    await userService.forgotPassword(dto);
    expect(userRepository.findOneBy).toHaveBeenCalled();
    expect(forgotPasswordRepository.create).toHaveBeenCalled();
    expect(forgotPasswordRepository.save).toHaveBeenCalled();
    expect(notificationService.sendEmail).toHaveBeenCalled();
  });

  it('should call userRepository.findOneBy and forgotPasswordRepository.createQueryBuilder on validateResetCode', async () => {
    const dto = new ValidateResetCodeDto();
    await userService.validateResetCode(dto);
    expect(userRepository.findOneBy).toHaveBeenCalled();
    expect(forgotPasswordRepository.createQueryBuilder).toHaveBeenCalled();
  });

  it('should throw an error when userRepository.findOneBy finds an existing user on signup', async () => {
    const dto = new SignupUserDto();
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(new User());

    await expect(userService.signup(dto)).rejects.toThrow(
      'User with this email already exists',
    );
  });

  it('should throw an error when validateResetCode returns false on changePassword', async () => {
    const dto = new ChangePasswordDto();
    jest
      .spyOn(userService, 'validateResetCode')
      .mockResolvedValueOnce({ isValid: false });

    await expect(userService.changePassword(dto)).rejects.toThrow(
      'Invalid reset code',
    );
  });
});
