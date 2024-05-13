import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordResponseDto {
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @IsString()
  @IsNotEmpty()
  message: string;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }
}
