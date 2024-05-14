import * as dotenv from 'dotenv';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('Config', () => {
  it('should load environment variables', () => {
    require('./config');
    expect(dotenv.config).toHaveBeenCalledTimes(1);
  });
});
