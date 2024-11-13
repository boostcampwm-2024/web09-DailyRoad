import pino from 'pino';
import { TraceService } from './trace/TraceService';

const ignoredFields = ['pid', 'hostname', 'context', 'req', 'res'];

const baseLoggerOptions = {
  colorize: true,
  translateTime: 'SYS:standard',
  ignore: ignoredFields.join(','),
  singleLine: false,
};

export function createLogger() {
  return pino({
    transport: {
      target: 'pino-pretty',
      options: baseLoggerOptions,
    },
    level: 'info',
  });
}

export function createLoggerWithTrace(traceService: TraceService) {
  return pino({
    mixin() {
      return { traceId: traceService.traceId };
    },
    transport: {
      target: 'pino-pretty',
      options: baseLoggerOptions,
    },
  });
}
