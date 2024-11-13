import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomNamingStrategy } from './CustomNamingStrategy';
import { PinoTypeORMLogger } from './CustomTypeORMLogger';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: false,
      namingStrategy: new CustomNamingStrategy(),
      timezone: '+09:00',
      logger: new PinoTypeORMLogger(this.logger),
      logging: true,
    };
  }
}
