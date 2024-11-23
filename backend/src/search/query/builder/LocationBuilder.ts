export const LocationQueryBuilders = {
  GAUSS_LOCATION: (
    latitude: number,
    longitude: number,
    scale = '10km',
    offset = '2km',
    decay = 0.5,
    weight = 20,
  ) => ({
    gauss: {
      location: {
        origin: `${latitude},${longitude}`,
        scale: scale,
        offset: offset,
        decay: decay,
      },
    },
    weight: weight,
  }),
};
