import { IsNotEmpty, IsString } from 'class-validator';

export class AuthResponseDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
