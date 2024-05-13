import { validate } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

describe('LoginUserDto', () => {
  let loginUserDto: LoginUserDto;

  it('should validate email and password fields', async () => {
    loginUserDto = new LoginUserDto('test@example.com', 'password123');

    const errors = await validate(loginUserDto);
    expect(errors.length).toEqual(0);
  });

  it('should fail validation if email is not valid', async () => {
    loginUserDto = new LoginUserDto('invalid email', 'password123');

    const errors = await validate(loginUserDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if password is empty', async () => {
    loginUserDto = new LoginUserDto('test@example.com', '');

    const errors = await validate(loginUserDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
