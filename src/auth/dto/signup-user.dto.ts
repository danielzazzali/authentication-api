import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class SignupUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  rut?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsNotEmpty()
  @Length(8, 32)
  password: string;
}
