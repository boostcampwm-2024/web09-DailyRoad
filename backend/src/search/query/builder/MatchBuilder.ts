const createMatchQuery = (
  field: string,
  query: string,
  fuzziness: number = 1,
) => ({
  match: {
    [field]: {
      query,
      fuzziness,
    },
  },
});

export const MatchBuilders = {
  MATCH_NAME: (query: string) => createMatchQuery('name', query),
  MATCH_FORMATTED_ADDRESS: (query: string) =>
    createMatchQuery('formattedAddress', query),
};
