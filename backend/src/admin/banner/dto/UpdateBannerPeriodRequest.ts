import { IsDateString } from 'class-validator';

export class UpdateBannerPeriodRequest {
  @IsDateString()
  startedAt: Date;

  @IsDateString()
  endedAt: Date;
}
