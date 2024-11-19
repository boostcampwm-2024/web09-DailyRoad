import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchController } from '@src/search/search.controller';
import { SearchService } from '@src/search/search.service';
import { PlaceModule } from '@src/place/place.module';

@Module({
  imports: [
    PlaceModule,
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
  providers: [SearchService],
  controllers: [SearchController],
  exports: [],
})
export class SearchModule {}
