import { validate } from 'class-validator';
import { ForgotPasswordResponseDto } from './forgot-password-response.dto';

describe('ForgotPasswordResponseDto', () => {
  let forgotPasswordResponseDto: ForgotPasswordResponseDto;

  it('should validate success and message fields', async () => {
    forgotPasswordResponseDto = new ForgotPasswordResponseDto(
      true,
      'Password reset email sent',
    );

    const errors = await validate(forgotPasswordResponseDto);
    expect(errors.length).toEqual(0);
  });

  it('should fail validation if success is not a boolean', async () => {
    forgotPasswordResponseDto = new ForgotPasswordResponseDto(
      // @ts-expect-error: Ignoring error to test validation
      'not a boolean',
      'Password reset email sent',
    );

    const errors = await validate(forgotPasswordResponseDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if message is not a string', async () => {
    // @ts-expect-error: Ignoring error to test validation
    forgotPasswordResponseDto = new ForgotPasswordResponseDto(true, 123);

    const errors = await validate(forgotPasswordResponseDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if success is empty', async () => {
    forgotPasswordResponseDto = new ForgotPasswordResponseDto(
      // @ts-expect-error: Ignoring error to test validation
      '',
      'Password reset email sent',
    );

    const errors = await validate(forgotPasswordResponseDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if message is empty', async () => {
    forgotPasswordResponseDto = new ForgotPasswordResponseDto(true, '');

    const errors = await validate(forgotPasswordResponseDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
