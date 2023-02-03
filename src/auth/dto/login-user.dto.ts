import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/* no extendemos signup el otro porque eso seria opcional y no debe ser asi */
export class LoginUserDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}
