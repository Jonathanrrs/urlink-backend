import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  description: string;
  @IsArray()
  @IsObject({ each: true })
  urls: object[];
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  slug: string;
  @IsString()
  @IsOptional()
  photo?: string;
}
