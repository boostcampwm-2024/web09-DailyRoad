import { DataSource } from 'typeorm';
import { CustomNamingStrategy } from '../src/config/CustomNamingStrategy';

export const createTestDataSource = async (container) => {
  return new DataSource({
    type: 'mysql',
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getUserPassword(),
    database: container.getDatabase(),
    entities: [__dirname + '/../src/**/*.entity.{ts,js}'],
    synchronize: true,
    namingStrategy: new CustomNamingStrategy(),
  });
};
