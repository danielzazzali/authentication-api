import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgotPassword } from './forgot-password.entity';

describe('ForgotPassword Entity', () => {
  let forgotPasswordRepository: Repository<ForgotPassword>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(ForgotPassword),
          useClass: Repository,
        },
      ],
    }).compile();

    forgotPasswordRepository = module.get<Repository<ForgotPassword>>(
      getRepositoryToken(ForgotPassword),
    );
  });

  it('should be defined', () => {
    expect(forgotPasswordRepository).toBeDefined();
  });
});
