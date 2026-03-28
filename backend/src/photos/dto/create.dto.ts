import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  image_url: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  collection_id?: string;

  @IsString()
  @IsOptional()
  access_type?: string; // 'public' | 'follow' | 'goal'
}
