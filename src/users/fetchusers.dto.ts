import { IsEmail, IsString } from 'class-validator';

export class FetchUsersDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
