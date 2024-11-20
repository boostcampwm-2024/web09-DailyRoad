const createPrefixQuery = (field: string, value: string) => ({
  prefix: {
    [field]: {
      value,
    },
  },
});

export const PrefixBuilders = {
  PREFIX_NAME: (query: string) => createPrefixQuery('name', query),
  PREFIX_FORMATTED_ADDRESS: (query: string) =>
    createPrefixQuery('formattedAddress', query),
};
