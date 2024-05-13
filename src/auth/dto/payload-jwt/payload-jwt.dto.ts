import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PayloadJwt {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsString()
  @IsOptional()
  rut?: string;

  constructor(
    email: string,
    firstName: string,
    lastName: string,
    rut?: string,
  ) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.rut = rut;
  }
}
