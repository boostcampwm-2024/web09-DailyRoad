import { MatchBuilders } from '@src/search/query/builder/MatchBuilder';
import { LocationQueryBuilders } from '@src/search/query/builder/LocationBuilder';
import { PrefixBuilders } from '@src/search/query/builder/PrefixBuilder';
import { FilterBuilders } from '@src/search/query/builder/FilterQueryBuilder';

export const ElasticSearchQueryBuilder = {
  ...MatchBuilders,
  ...LocationQueryBuilders,
  ...PrefixBuilders,
  ...FilterBuilders,
};
