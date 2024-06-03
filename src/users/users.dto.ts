import { IsString, IsEmail, MinLength,Matches } from 'class-validator';

export class UsersDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password too weak and at least 8 character , contain at least one letter, number,special character.',
  })
  readonly password: string;
}
