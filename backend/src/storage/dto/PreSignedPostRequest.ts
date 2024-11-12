import { IsNotEmpty, IsString } from 'class-validator';
import { IsImageFile } from '../storage.validator';

export class PreSignedPostRequest {
  @IsString()
  @IsNotEmpty()
  dirName: string;

  @IsString()
  @IsNotEmpty()
  @IsImageFile()
  extension: string;
}
