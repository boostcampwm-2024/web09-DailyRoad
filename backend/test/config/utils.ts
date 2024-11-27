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

const ALL_TABLE_NAMES = [
  'USER',
  'PLACE',
  'MAP',
  'COURSE',
  'MAP_PLACE',
  'COURSE_PLACE',
  'REFRESH_TOKEN',
  'BANNER',
];

export async function truncateTables(
  dataSource: DataSource,
  tableNames: string[] = ALL_TABLE_NAMES,
) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await queryRunner.startTransaction();

    // 외래 키 제약 조건 해제
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

    // 각 테이블에 대해 TRUNCATE 실행
    for (const tableName of tableNames) {
      await queryRunner.query(`TRUNCATE TABLE \`${tableName.toUpperCase()}\`;`);
    }

    // 외래 키 제약 조건 복원
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
