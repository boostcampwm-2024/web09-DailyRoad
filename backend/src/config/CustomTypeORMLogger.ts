import { Logger as TypeORMLogger, QueryRunner } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';

export class PinoTypeORMLogger implements TypeORMLogger {
  constructor(private readonly logger: PinoLogger) {}

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.debug(
      { query, parameters },
      'Executing query in ' + this.getTransactionId(queryRunner),
    );
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.error(
      { error, query, parameters },
      'Query error in ' + this.getTransactionId(queryRunner),
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.warn(
      { time, query, parameters },
      'Slow query detected in ' + this.getTransactionId(queryRunner),
    );
  }

  logSchemaBuild(message: string) {
    this.logger.info(message, 'Schema build log');
  }

  logMigration(message: string) {
    this.logger.info(message, 'Migration log');
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'log':
        this.logger.info(message);
        break;
      case 'info':
        this.logger.info(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
    }
  }

  private getTransactionId(queryRunner?: QueryRunner): string {
    if (queryRunner) {
      if (!queryRunner.data.transactionId) {
        queryRunner.data.transactionId = randomUUID();
      }
      return queryRunner.data.transactionId;
    }
    return 'No transaction';
  }
}
