import { MySqlContainer } from '@testcontainers/mysql';
import * as path from 'node:path';

export default async () => {
  const ddlScriptPath = path.resolve(__dirname, '../../resources/sql/DDL.sql');

  global.reusedContainer = await new MySqlContainer()
    .withUsername('testUser')
    .withUserPassword('testPassword')
    .withDatabase('testDB')
    .withReuse()
    .withBindMounts([
      { source: ddlScriptPath, target: '/docker-entrypoint-initdb.d/DDL.sql' },
    ])
    .start();
};
