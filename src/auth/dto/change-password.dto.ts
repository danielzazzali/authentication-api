import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(6, 6)
  code: string;

  @IsNotEmpty()
  @Length(8, 32)
  password: string;

  @IsNotEmpty()
  @Length(8, 32)
  passwordConfirmation: string;
}
