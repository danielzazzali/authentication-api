import { validate } from 'class-validator';
import { ValidateResetCodeDto } from './validate-reset-code.dto';

describe('ValidateResetCodeDto', () => {
  let validateResetCodeDto: ValidateResetCodeDto;

  it('should validate email and code fields', async () => {
    validateResetCodeDto = new ValidateResetCodeDto();
    validateResetCodeDto.email = 'test@example.com';
    validateResetCodeDto.code = '123456';

    const errors = await validate(validateResetCodeDto);
    expect(errors.length).toEqual(0);
  });

  it('should fail validation if email is not valid', async () => {
    validateResetCodeDto = new ValidateResetCodeDto();
    validateResetCodeDto.email = 'invalid email';
    validateResetCodeDto.code = '123456';

    const errors = await validate(validateResetCodeDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if code is not valid', async () => {
    validateResetCodeDto = new ValidateResetCodeDto();
    validateResetCodeDto.email = 'test@example.com';
    validateResetCodeDto.code = '12345';

    const errors = await validate(validateResetCodeDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
