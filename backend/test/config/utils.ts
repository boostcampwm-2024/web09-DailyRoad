import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MySqlContainer } from '@testcontainers/mysql';
import { DataSource } from 'typeorm';
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
