import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { PinoLogger } from 'nestjs-pino';
import { SearchController } from '@src/search/SearchController';
import { SearchService } from '@src/search/SearchService';
import { ElasticSearchQuery } from '@src/search/query/ElasticSearchQuery';
import { PlaceModule } from '@src/place/PlaceModule';

@Module({
  imports: [
    forwardRef(() => PlaceModule),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node:
          configService.get<string>('ELASTICSEARCH_NODE') ||
          'http://localhost:9200',
        auth: {
          username: configService.get<string>('ELASTICSEARCH_USERNAME') || '',
          password: configService.get<string>('ELASTICSEARCH_PASSWORD') || '',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SearchService, ElasticSearchQuery, PinoLogger],
  controllers: [SearchController],
  exports: [SearchService, ElasticSearchQuery, ElasticsearchModule],
})
export class SearchModule {}
