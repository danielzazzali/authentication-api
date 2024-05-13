import { validate } from 'class-validator';
import { ValidateResetCodeResponseDto } from './validate-reset-code-response.dto';

describe('ValidateResetCodeResponseDto', () => {
  let validateResetCodeResponseDto: ValidateResetCodeResponseDto;

  it('should validate isValid field', async () => {
    validateResetCodeResponseDto = new ValidateResetCodeResponseDto(true);

    const errors = await validate(validateResetCodeResponseDto);
    expect(errors.length).toEqual(0);
  });

  it('should fail validation if isValid is not a boolean', async () => {
    validateResetCodeResponseDto = new ValidateResetCodeResponseDto(
      // @ts-expect-error: Ignoring error to test validation
      'not a boolean',
    );

    const errors = await validate(validateResetCodeResponseDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if isValid is not provided', async () => {
    // @ts-expect-error: Ignoring error to test validation
    validateResetCodeResponseDto = new ValidateResetCodeResponseDto();

    const errors = await validate(validateResetCodeResponseDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
