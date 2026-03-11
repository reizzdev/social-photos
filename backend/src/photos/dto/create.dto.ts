import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  image_url: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
