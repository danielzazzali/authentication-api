import { validate } from 'class-validator';
import { AuthResponseDto } from './auth-response.dto';

describe('AuthResponseDto', () => {
  let authResponseDto: AuthResponseDto;

  it('should validate token field', async () => {
    authResponseDto = new AuthResponseDto('validToken');

    const errors = await validate(authResponseDto);
    expect(errors.length).toEqual(0);
  });

  it('should fail validation if token is not a string', async () => {
    // @ts-expect-error: Ignoring error to test validation
    authResponseDto = new AuthResponseDto(123);

    const errors = await validate(authResponseDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if token is empty', async () => {
    authResponseDto = new AuthResponseDto('');

    const errors = await validate(authResponseDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
