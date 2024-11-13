import { Module } from '@nestjs/common';
import { TraceService } from './TraceService';

@Module({
  providers: [TraceService],
  exports: [TraceService],
})
export class TraceModule {}
