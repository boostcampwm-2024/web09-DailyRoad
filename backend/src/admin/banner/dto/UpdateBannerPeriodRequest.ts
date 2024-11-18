import { IsDate } from 'class-validator';

export class UpdateBannerPeriodRequest {
  @IsDate()
  startedAt: Date;

  @IsDate()
  endedAt: Date;
}
