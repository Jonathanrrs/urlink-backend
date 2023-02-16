import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  // IsOptional,
} from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;
  // @IsString()
  // @IsOptional()
  // photo?: string;
}
