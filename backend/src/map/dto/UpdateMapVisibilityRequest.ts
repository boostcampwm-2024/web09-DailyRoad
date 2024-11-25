import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateMapVisibilityRequest {
  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;
}
