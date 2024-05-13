import { validate } from 'class-validator';
import { ForgotPasswordDto } from './forgot-password.dto';

describe('ForgotPasswordDto', () => {
  let forgotPasswordDto: ForgotPasswordDto;

  it('should validate email field', async () => {
    forgotPasswordDto = new ForgotPasswordDto();
    forgotPasswordDto.email = 'test@example.com';

    const errors = await validate(forgotPasswordDto);
    expect(errors.length).toEqual(0);
  });

  it('should fail validation if email is not valid', async () => {
    forgotPasswordDto = new ForgotPasswordDto();
    forgotPasswordDto.email = 'invalid email';

    const errors = await validate(forgotPasswordDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if email is empty', async () => {
    forgotPasswordDto = new ForgotPasswordDto();
    forgotPasswordDto.email = '';

    const errors = await validate(forgotPasswordDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
