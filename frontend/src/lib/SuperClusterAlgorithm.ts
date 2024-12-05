import {
  AlgorithmInput,
  AlgorithmOutput,
  getPaddedViewport,
  MarkerUtils,
  SuperClusterViewportAlgorithm,
  SuperClusterViewportOptions,
  SuperClusterViewportState,
} from '@googlemaps/markerclusterer';
import equal from 'fast-deep-equal';

export class SuperClusterAlgorithmTest extends SuperClusterViewportAlgorithm {
  constructor({ ...options }: SuperClusterViewportOptions) {
    super(options);
    this.clusters = [];
  }

  public calculate(input: AlgorithmInput): AlgorithmOutput {
    const state: SuperClusterViewportState = {
      zoom: Math.round(input.map.getZoom()!),
      view: getPaddedViewport(
        input.map.getBounds()!,
        input.mapCanvasProjection,
        this.viewportPadding,
      ),
    };

    let changed = !equal(this.state, state);

    if (!equal(input.markers, this.markers)) {
      changed = true;
      // TODO use proxy to avoid copy?
      this.markers = [...input.markers];

      const points = this.markers.map((marker) => {
        const position = MarkerUtils.getPosition(marker);
        const coordinates = [position.lng(), position.lat()];
        return {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates,
          },
          properties: { marker },
        };
      });
      this.superCluster.load(points);
    }

    if (changed) {
      this.clusters = this.cluster(input);
      this.state = state;
    }

    return { clusters: this.clusters, changed };
  }
}
