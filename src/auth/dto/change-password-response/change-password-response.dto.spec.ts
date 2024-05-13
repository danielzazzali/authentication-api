import { validate } from 'class-validator';
import { ChangePasswordResponseDto } from './change-password-response.dto';

describe('ChangePasswordResponseDto', () => {
  let changePasswordResponseDto: ChangePasswordResponseDto;

  it('should validate success and message fields', async () => {
    changePasswordResponseDto = new ChangePasswordResponseDto(
      true,
      'Password changed successfully',
    );

    const errors = await validate(changePasswordResponseDto);
    expect(errors.length).toEqual(0);
  });

  it('should fail validation if success is not a boolean', async () => {
    changePasswordResponseDto = new ChangePasswordResponseDto(
      // @ts-expect-error: Ignoring error to test validation
      'not a boolean',
      'Password changed successfully',
    );

    const errors = await validate(changePasswordResponseDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if message is not a string', async () => {
    // @ts-expect-error: Ignoring error to test validation
    changePasswordResponseDto = new ChangePasswordResponseDto(true, 123);

    const errors = await validate(changePasswordResponseDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if success is empty', async () => {
    changePasswordResponseDto = new ChangePasswordResponseDto(
      // @ts-expect-error: Ignoring error to test validation
      '',
      'Password changed successfully',
    );

    const errors = await validate(changePasswordResponseDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if message is empty', async () => {
    changePasswordResponseDto = new ChangePasswordResponseDto(true, '');

    const errors = await validate(changePasswordResponseDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
