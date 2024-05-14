import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { NotificationService } from '../notification/notification.service';
import { TokenService } from '../token/token.service';
import { userProviders } from './user.providers';

describe('UserModule', () => {
  let userModule: UserModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, DatabaseModule],
      controllers: [],
      providers: [
        ...userProviders,
        UserService,
        NotificationService,
        TokenService,
      ],
      exports: [UserService],
    }).compile();

    userModule = module.get<UserModule>(UserModule);
  });

  it('should be defined', () => {
    expect(userModule).toBeDefined();
  });
});
