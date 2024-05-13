import { validate } from 'class-validator';
import { SignupUserDto } from './signup-user.dto';

describe('SignupUserDto', () => {
  let signupUserDto: SignupUserDto;

  it('should validate email and password fields', async () => {
    signupUserDto = new SignupUserDto();
    signupUserDto.email = 'test@example.com';
    signupUserDto.password = 'password123';

    const errors = await validate(signupUserDto);
    expect(errors.length).toEqual(0);
  });

  it('should fail validation if email is not valid', async () => {
    signupUserDto = new SignupUserDto();
    signupUserDto.email = 'invalid email';
    signupUserDto.password = 'password123';

    const errors = await validate(signupUserDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if password is not valid', async () => {
    signupUserDto = new SignupUserDto();
    signupUserDto.email = 'test@example.com';
    signupUserDto.password = 'short';

    const errors = await validate(signupUserDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should pass validation if optional fields are not provided', async () => {
    signupUserDto = new SignupUserDto();
    signupUserDto.email = 'test@example.com';
    signupUserDto.password = 'password123';

    const errors = await validate(signupUserDto);
    expect(errors.length).toEqual(0);
  });

  it('should fail validation if rut is not a string', async () => {
    signupUserDto = new SignupUserDto();
    signupUserDto.email = 'test@example.com';
    signupUserDto.password = 'password123';
    // @ts-expect-error: Ignoring error to test validation
    signupUserDto.rut = { not: 'a string' };

    const errors = await validate(signupUserDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if firstName is not a string', async () => {
    signupUserDto = new SignupUserDto();
    signupUserDto.email = 'test@example.com';
    signupUserDto.password = 'password123';
    // @ts-expect-error: Ignoring error to test validation
    signupUserDto.firstName = { not: 'a string' };

    const errors = await validate(signupUserDto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if lastName is not a string', async () => {
    signupUserDto = new SignupUserDto();
    signupUserDto.email = 'test@example.com';
    signupUserDto.password = 'password123';
    // @ts-expect-error: Ignoring error to test validation
    signupUserDto.lastName = { not: 'a string' };

    const errors = await validate(signupUserDto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
