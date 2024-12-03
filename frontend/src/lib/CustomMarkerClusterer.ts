import {
  ClusterStats,
  Marker,
  MarkerClusterer,
  MarkerClustererEvents,
  MarkerClustererOptions,
  MarkerUtils,
  SuperClusterViewportAlgorithm,
} from '@googlemaps/markerclusterer';
import { clusterMarkerRender } from './clusterMarkerRender';

export class CustomMarkerClusterer extends MarkerClusterer {
  lastGroupMarkers: Marker[];
  constructor(options: MarkerClustererOptions) {
    super(options);
    this.lastGroupMarkers = [];
  }

  public onAdd(): void {
    const map = this.getMap();
    if (!map) return;
    this.idleListener = map.addListener('idle', () => {
      this.render();
    });
    this.render();
  }

  public addMarker(
    marker: google.maps.marker.AdvancedMarkerElement,
    noDraw?: boolean,
  ): void {
    if (this.markers.includes(marker)) {
      return;
    }

    this.markers.push(marker);

    if (!noDraw) {
      this.render();
    }
  }

  public removeMarker(
    marker: google.maps.marker.AdvancedMarkerElement,
    noDraw?: boolean,
  ): boolean {
    const index = this.markers.indexOf(marker);
    if (index === -1) {
      return false;
    }

    MarkerUtils.setMap(marker, null);
    this.markers.splice(index, 1);
    if (!noDraw) {
      this.render();
    }

    return true;
  }

  public render(): void {
    const map = this.getMap();
    if (map instanceof google.maps.Map && map.getProjection()) {
      google.maps.event.trigger(
        this,
        MarkerClustererEvents.CLUSTERING_BEGIN,
        this,
      );
      const { clusters, changed } = this.algorithm.calculate({
        markers: this.markers,
        map,
        mapCanvasProjection: this.getProjection(),
      });

      if (changed || changed === undefined) {
        const singleMarker = new Set<Marker>();
        for (const cluster of clusters) {
          if (cluster.markers?.length === 1) {
            singleMarker.add(cluster.markers[0]);
          }
        }

        const groupMarkers: Marker[] = [];

        for (const cluster of this.clusters) {
          if (cluster.marker === null) {
            continue;
          }
          if (cluster.markers?.length === 1) {
            if (!singleMarker.has(cluster.marker!)) {
              MarkerUtils.setMap(cluster.marker!, null);
            }
          } else {
            groupMarkers.push(cluster.marker!);
          }
        }

        this.clusters = clusters;
        this.renderClusters();

        setTimeout(() => {
          groupMarkers.forEach((marker) => {
            MarkerUtils.setMap(marker, null);
          });
        }, 25);
      }
      google.maps.event.trigger(
        this,
        MarkerClustererEvents.CLUSTERING_END,
        this,
      );
    }
  }

  protected renderClusters(): void {
    // Generate stats to pass to renderers.
    const stats = new ClusterStats(this.markers, this.clusters);

    const map = this.getMap() as google.maps.Map;

    this.clusters.forEach((cluster) => {
      if (cluster.markers?.length === 1) {
        cluster.marker = cluster.markers[0];
      } else {
        // Generate the marker to represent the group.
        cluster.marker = this.renderer.render(cluster, stats, map);
        // Make sure all individual markers are removed from the map.
        cluster.markers?.forEach((marker) => MarkerUtils.setMap(marker, null));
        if (this.onClusterClick) {
          cluster.marker.addListener(
            'click',
            /* istanbul ignore next */
            (event: google.maps.MapMouseEvent) => {
              google.maps.event.trigger(
                this,
                MarkerClustererEvents.CLUSTER_CLICK,
                cluster,
              );
              this.onClusterClick(event, cluster, map);
            },
          );
        }
      }
      MarkerUtils.setMap(cluster.marker, map);
    });
  }
}

export const clustererOptions = {
  algorithm: new SuperClusterViewportAlgorithm({ maxZoom: 18 }),
  renderer: {
    render: clusterMarkerRender,
  },
};
