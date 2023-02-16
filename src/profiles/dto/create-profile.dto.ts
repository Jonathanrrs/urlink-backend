import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  description: string;
  @IsArray()
  @IsObject({ each: true })
  urls: object[];
  @IsString()
  @IsOptional()
  photo?: string;
}
