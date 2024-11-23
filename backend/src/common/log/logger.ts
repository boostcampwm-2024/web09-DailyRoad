import pino from 'pino';

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

const logstashLoggerOptions = (host: string, port: number) => ({
  ...baseLoggerOptions,
  level: 'info',
  formatters: {
    ...baseLoggerOptions.formatters,
    bindings() {
      return {};
    },
    log(object: Record<string, unknown>) {
      return Object.keys(object)
        .filter((key) => !ignoredFields.includes(key))
        .reduce(
          (acc, key) => {
            acc[key] = object[key];
            return acc;
          },
          {} as Record<string, unknown>,
        );
    },
  },
  transport: {
    target: 'pino-socket',
    options: {
      address: host,
      port,
      mode: 'tcp',
      reconnect: true,
      timeout: 5000,
      recover: true,
    },
  },
});

export function createLogger(host: string, port: number) {
  if (process.env.NODE_ENV === 'prod') {
    return pino(logstashLoggerOptions(host, port));
  }

  return pino(consoleLoggerOptions);
}
