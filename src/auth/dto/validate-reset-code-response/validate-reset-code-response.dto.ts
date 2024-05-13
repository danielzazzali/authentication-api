import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ValidateResetCodeResponseDto {
  @IsBoolean()
  @IsNotEmpty()
  isValid: boolean;

  constructor(isValid: boolean) {
    this.isValid = isValid;
  }
}
