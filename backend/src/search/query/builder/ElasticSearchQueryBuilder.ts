import { MatchBuilders } from '@src/search/query/builder/MatchBuilder';
import { LocationQueryBuilder } from '@src/search/query/builder/LocationBuilder';

export const ElasticSearchQueryBuilder = {
  ...MatchBuilders,
  ...LocationQueryBuilder,
};
