import pino from 'pino';
import * as net from 'node:net';

const baseLoggerOptions = {
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  messageKey: 'msg',
  formatters: {
    level(label: string) {
      return { level: label };
    },
  },
};

const ignoredFields = ['pid', 'hostname', 'context', 'req', 'res'];

const consoleLoggerOptions = {
  ...baseLoggerOptions,
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: ignoredFields.join(','),
      singleLine: false,
    },
  },
};

const logstashLoggerOptions = {
  ...baseLoggerOptions,
  level: 'info',
  formatters: {
    ...baseLoggerOptions.formatters,
    bindings() {
      return {};
    },
    log(object: object) {
      return Object.keys(object)
        .filter((key) => !ignoredFields.includes(key))
        .reduce((acc, key) => {
          acc[key] = object[key];
          return acc;
        }, {});
    },
  },
};

export function createLogger(host: string, port: number) {
  if (process.env.NODE_ENV === 'prod') {
    const stream = net.createConnection({ host, port, timeout: 5000 });
    stream.on('error', (err) => {
      console.error('Log Stream connection error:', err);
    });

    return pino(logstashLoggerOptions, stream);
  }
  return pino(consoleLoggerOptions);
}
