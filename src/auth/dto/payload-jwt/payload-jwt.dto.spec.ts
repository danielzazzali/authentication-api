import { validate } from 'class-validator';
import { PayloadJwt } from './payload-jwt.dto';

describe('PayloadJwt', () => {
  let payloadJwt: PayloadJwt;

  it('should validate email, firstName, lastName, and rut fields', async () => {
    payloadJwt = new PayloadJwt(
      'test@example.com',
      'John',
      'Doe',
      '12345678-9',
    );

    const errors = await validate(payloadJwt);
    expect(errors.length).toEqual(0);
  });

  it('should fail validation if email is not valid', async () => {
    payloadJwt = new PayloadJwt('invalid email', 'John', 'Doe', '12345678-9');

    const errors = await validate(payloadJwt);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if firstName is not a string', async () => {
    // @ts-expect-error: Ignoring error to test validation
    payloadJwt = new PayloadJwt('test@example.com', 123, 'Doe', '12345678-9');

    const errors = await validate(payloadJwt);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation if lastName is not a string', async () => {
    // @ts-expect-error: Ignoring error to test validation
    payloadJwt = new PayloadJwt('test@example.com', 'John', 123, '12345678-9');

    const errors = await validate(payloadJwt);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should pass validation if rut is not provided', async () => {
    payloadJwt = new PayloadJwt('test@example.com', 'John', 'Doe');

    const errors = await validate(payloadJwt);
    expect(errors.length).toEqual(0);
  });

  it('should fail validation if rut is not a string', async () => {
    // @ts-expect-error: Ignoring error to test validation
    payloadJwt = new PayloadJwt('test@example.com', 'John', 'Doe', 123456789);

    const errors = await validate(payloadJwt);
    expect(errors.length).toBeGreaterThan(0);
  });
});
