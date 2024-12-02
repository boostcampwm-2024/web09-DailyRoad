import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Color } from '@src/place/enum/Color';

export class UpdatePinInfoInMapRequest {
  @IsOptional()
  @IsEnum(Color)
  color?: Color;

  @IsOptional()
  @IsString()
  comment?: string;

  isEmpty(): boolean {
    return !this.color && !this.comment;
  }
}
