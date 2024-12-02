import { IsNotEmpty, IsString } from 'class-validator';
import { IsImageFile } from '@src/storage/validator/IsImageFile';

export class PreSignedPostRequest {
  @IsString()
  @IsNotEmpty()
  dirName: string;

  @IsString()
  @IsNotEmpty()
  @IsImageFile()
  extension: string;
}
