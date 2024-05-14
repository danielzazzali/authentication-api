import { Test, TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { TokenService } from './token.service';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked_token'),
}));

describe('TokenService', () => {
  let service: TokenService;
  let mockJwt: jest.MockedFunction<typeof jwt.sign>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
    mockJwt = jwt.sign as jest.MockedFunction<typeof jwt.sign>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encrypt token', () => {
    const payload = { data: 'test' };
    const token = service.encryptToken(payload);

    expect(mockJwt).toHaveBeenCalledWith(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    expect(token).toEqual('mocked_token');
  });
});
