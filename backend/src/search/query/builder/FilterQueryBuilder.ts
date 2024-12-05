const createTermFilter = (field: string, value: string, weight: number) => ({
  filter: {
    term: {
      [field]: value,
    },
  },
  weight,
});

const createMatchFilter = (field: string, value: string, weight: number) => ({
  filter: {
    match: {
      [field]: value,
    },
  },
  weight,
});

export const FilterBuilders = {
  FILTER_TERM_NAME_KEYWORD: (query: string, weight: number = 50) =>
    createTermFilter('name.keyword', query, weight),
  FILTER_MATCH_NAME: (token: string, weight: number = 15) =>
    createMatchFilter('name', token, weight),
  FILTER_MATCH_FORMATTED_ADDRESS: (token: string, weight: number = 10) =>
    createMatchFilter('formattedAddress', token, weight),
};
