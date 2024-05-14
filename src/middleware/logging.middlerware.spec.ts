import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response, NextFunction } from 'express';
import { LoggingMiddleware } from './logging.middleware';

describe('LoggingMiddleware', () => {
  let middleware: LoggingMiddleware;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingMiddleware],
    }).compile();

    middleware = module.get<LoggingMiddleware>(LoggingMiddleware);

    mockReq = {
      headers: {
        host: 'localhost',
        'user-agent': 'test agent',
        accept: 'application/json',
        'accept-language': 'en-US',
        'accept-encoding': 'gzip, deflate, br',
      },
      method: 'GET',
      originalUrl: '/test',
      body: { key: 'value' },
    };

    mockRes = {
      send: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call next function', () => {
    middleware.use(mockReq as Request, mockRes as Response, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should log request and response details', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    middleware.use(mockReq as Request, mockRes as Response, mockNext);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
