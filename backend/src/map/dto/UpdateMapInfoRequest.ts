import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMapInfoRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description?: string;
}
