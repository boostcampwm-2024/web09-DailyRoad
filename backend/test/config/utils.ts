import { DataSource } from 'typeorm';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MySqlContainer } from '@testcontainers/mysql';
import { Test, TestingModule } from '@nestjs/testing';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { initDataSource } from '@test/config/datasource.config';
import { AppModule } from '@src/app.module';

interface TestSetup {
  app: INestApplication;
  dataSource: DataSource;
}

export async function initializeIntegrationTestEnvironment(): Promise<TestSetup> {
  initializeTransactionalContext();

  const container = await new MySqlContainer().withReuse().start();
  const dataSource = await initDataSource(container);
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DataSource)
    .useValue(dataSource)
    .compile();
  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.init();

  return { app, dataSource };
}

export function convertDateToSeoulTime(dateTime: Date): string {
  return dateTime.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}

export async function truncateTables(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await queryRunner.startTransaction();

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

    const tables = await queryRunner.query(`
        SELECT TABLE_NAME
        FROM information_schema.tables
        WHERE table_schema = DATABASE();
    `);

    for (const { TABLE_NAME } of tables) {
      await queryRunner.query(`TRUNCATE TABLE \`${TABLE_NAME}\`;`);
    }

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
