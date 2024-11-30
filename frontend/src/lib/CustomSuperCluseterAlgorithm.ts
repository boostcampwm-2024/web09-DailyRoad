import {
  Marker,
  SuperClusterViewportAlgorithm,
  SuperClusterViewportOptions,
} from '@googlemaps/markerclusterer';

export class CustomSuperClusterAlgorithm extends SuperClusterViewportAlgorithm {
  constructor({ ...options }: SuperClusterViewportOptions) {
    super(options);
  }
}

const createMarkerProxy = (markers: Marker[], onchange: () => void) => {};
