import { IsNotEmpty, IsString } from 'class-validator';
import { IsImageFile } from '../validator/storage.validator';

export class PreSignedPostRequest {
  @IsString()
  @IsNotEmpty()
  dirName: string;

  @IsString()
  @IsNotEmpty()
  @IsImageFile()
  extension: string;
}
