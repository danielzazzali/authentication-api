import { validate } from 'class-validator';
import { ChangePasswordDto } from './change-password.dto';

describe('ChangePasswordDto', () => {
  let changePasswordDto: ChangePasswordDto;

  it('should validate email, code, password and passwordConfirmation fields', async () => {
    changePasswordDto = new ChangePasswordDto();
    changePasswordDto.email = 'test@example.com';
    changePasswordDto.code = '123456';
    changePasswordDto.password = 'password123';
    changePasswordDto.passwordConfirmation = 'password123';

    const errors = await validate(changePasswordDto);
    expect(errors.length).toEqual(0);
  });

  it('should fail validation if email is not valid', async () => {
    changePasswordDto = new ChangePasswordDto();
    changePasswordDto.email = 'invalid email';
    changePasswordDto.code = '123456';
    changePasswordDto.password = 'password123';
    changePasswordDto.passwordConfirmation = 'password123';

    const errors = await validate(changePasswordDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if code is not 6 characters long', async () => {
    changePasswordDto = new ChangePasswordDto();
    changePasswordDto.email = 'test@example.com';
    changePasswordDto.code = '123';
    changePasswordDto.password = 'password123';
    changePasswordDto.passwordConfirmation = 'password123';

    const errors = await validate(changePasswordDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if password is not between 8 and 32 characters long', async () => {
    changePasswordDto = new ChangePasswordDto();
    changePasswordDto.email = 'test@example.com';
    changePasswordDto.code = '123456';
    changePasswordDto.password = 'pass';
    changePasswordDto.passwordConfirmation = 'pass';

    const errors = await validate(changePasswordDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if passwordConfirmation is not between 8 and 32 characters long', async () => {
    changePasswordDto = new ChangePasswordDto();
    changePasswordDto.email = 'test@example.com';
    changePasswordDto.code = '123456';
    changePasswordDto.password = 'password123';
    changePasswordDto.passwordConfirmation = 'pass';

    const errors = await validate(changePasswordDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
