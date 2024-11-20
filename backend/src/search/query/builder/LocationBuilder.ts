export const LocationQueryBuilder = {
  GAUSS_LOCATION: (
    lat: number,
    long: number,
    scale = '10km',
    offset = '2km',
    decay = 0.5,
    weight = 20,
  ) => ({
    gauss: {
      location: {
        origin: `${lat},${long}`,
        scale: scale,
        offset: offset,
        decay: decay,
      },
    },
    weight: weight,
  }),
};
