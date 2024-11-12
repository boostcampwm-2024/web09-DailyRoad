import { IsNotEmpty, IsString } from 'class-validator';

export class PreSignedPostRequest {
  @IsString()
  @IsNotEmpty()
  dirName: string;

  @IsString()
  @IsNotEmpty()
  extension: string;
}
