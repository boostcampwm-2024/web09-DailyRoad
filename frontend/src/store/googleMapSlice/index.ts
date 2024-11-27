import { INITIAL_MAP_CONFIG } from '@/constants/map';
import { StateCreator } from 'zustand';
import { StoreState } from '@/types';
import {
  getGoogleMapClass,
  getPlaceClass,
  loadGoogleMapsApi,
} from '@/lib/googleMapsAPI-loader';
import {
  Cluster,
  ClusterStats,
  Marker,
  MarkerClusterer,
  MarkerClustererEvents,
  MarkerClustererOptions,
  MarkerUtils,
  SuperClusterViewportAlgorithm,
} from '@googlemaps/markerclusterer';

export type GoogleMapState = {
  googleMap: google.maps.Map | null;
  markerClusterer: MarkerClusterer | null;
  setGoogleMap: (map: google.maps.Map) => void;
  initializeMap: (container: HTMLElement) => void;
  moveTo: (lat: number, lng: number) => void;
  findPlaces: (query: string) => void;
  addMarker: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  removeMarker: (marker: google.maps.marker.AdvancedMarkerElement) => void;
};

export const createGoogleMapSlice: StateCreator<
  StoreState,
  [],
  [],
  GoogleMapState
> = (set, get) => ({
  googleMap: null,
  markerClusterer: null,
  markerId: 1,
  setGoogleMap: (map: google.maps.Map) => set({ googleMap: map }),

  initializeMap: async (container: HTMLElement) => {
    await loadGoogleMapsApi();
    const GoogleMap = getGoogleMapClass();
    const map = new GoogleMap(container, INITIAL_MAP_CONFIG);
    const markerClusterer = new cMarkerClusterer({
      map,
      algorithm: new SuperClusterViewportAlgorithm({ maxZoom: 15 }),
      renderer: {
        render: (
          { count, position }: Cluster,
          stats: ClusterStats,
          map: google.maps.Map,
        ) => {
          // change color if this cluster has more markers than the mean cluster
          const color =
            count > Math.max(10, stats.clusters.markers.mean)
              ? '#88BDF2'
              : '#BDDDFC';

          //<circle cx="120" cy="120" opacity=".6" r="70" />
          //<circle cx="120" cy="120" opacity=".2" r="110" />
          // create svg literal with fill color
          const svg = `<svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50" style="filter: drop-shadow(2px 4px 6px rgba(0.5, 0.5, 0.5, 0.5));">
<circle cx="120" cy="120" opacity="1" r="90" />
<text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="Pretendard,roboto,arial,sans-serif">${count}</text>
</svg>`;

          // adjust zIndex to be above other markers
          const zIndex: number = Number(google.maps.Marker.MAX_ZINDEX) + count;

          if (MarkerUtils.isAdvancedMarkerAvailable(map)) {
            // create cluster SVG element
            const parser = new DOMParser();
            const svgEl = parser.parseFromString(
              svg,
              'image/svg+xml',
            ).documentElement;
            svgEl.setAttribute('transform', 'translate(0 25)');

            const clusterOptions: google.maps.marker.AdvancedMarkerElementOptions =
              {
                map,
                position,
                zIndex,
                content: svgEl,
              };
            return new google.maps.marker.AdvancedMarkerElement(clusterOptions);
          }

          const clusterOptions: google.maps.MarkerOptions = {
            position,
            zIndex,
            icon: {
              url: `data:image/svg+xml;base64,${btoa(svg)}`,
              anchor: new google.maps.Point(25, 25),
            },
          };
          return new google.maps.Marker(clusterOptions);
        },
      },
    });
    set({ googleMap: map, markerClusterer });
  },

  moveTo: (lat: number, lng: number) => {
    const map = get().googleMap;
    if (map) {
      map.panTo({ lat, lng });
    }
  },

  findPlaces: async (query: string) => {
    if (!query) {
      return;
    }
    const Place = getPlaceClass();
    const request: google.maps.places.SearchByTextRequest = {
      textQuery: query,
      language: 'ko',
      region: 'KR',
      fields: ['location', 'displayName'],
      maxResultCount: 7,
    };
    const { places } = await Place.searchByText(request);
    return places;
  },

  addMarker: (marker: google.maps.marker.AdvancedMarkerElement) => {
    const { markerClusterer } = get();
    markerClusterer?.addMarker(marker);
  },

  removeMarker: (marker: google.maps.marker.AdvancedMarkerElement) => {
    const { markerClusterer } = get();
    markerClusterer?.removeMarker(marker);
  },
});

class cMarkerClusterer extends MarkerClusterer {
  lastGroupMarkers: Marker[];
  constructor(options: MarkerClustererOptions) {
    super(options);
    this.lastGroupMarkers = [];
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

      // Allow algorithms to return flag on whether the clusters/markers have changed.
      if (changed || changed == undefined) {
        // Accumulate the markers of the clusters composed of a single marker.
        // Those clusters directly use the marker.
        // Clusters with more than one markers use a group marker generated by a renderer.
        const singleMarker = new Set<Marker>();
        for (const cluster of clusters) {
          if (cluster.markers?.length == 1) {
            singleMarker.add(cluster.markers[0]);
          }
        }

        const groupMarkers: Marker[] = [];
        // Iterate the clusters that are currently rendered.
        for (const cluster of this.clusters) {
          if (cluster.marker == null) {
            continue;
          }
          if (cluster.markers?.length == 1) {
            if (!singleMarker.has(cluster.marker)) {
              // The marker:
              // - was previously rendered because it is from a cluster with 1 marker,
              // - should no more be rendered as it is not in singleMarker.
              MarkerUtils.setMap(cluster.marker, null);
            }
          } else {
            // Delay the removal of old group markers to avoid flickering.
            groupMarkers.push(cluster.marker);
            // cluster.markers?.forEach((marker) => {
            //   MarkerUtils.setMap(marker, null);
            // });
          }
        }

        this.clusters = clusters;
        this.renderClusters();
        console.log(groupMarkers);
        //needRepaintGroupMarkers =
        // Delayed removal of the markers of the former groups.
        // requestAnimationFrame(() =>
        setTimeout(() => {
          groupMarkers.forEach((marker) => MarkerUtils.setMap(marker, null));
        }, 10); // 필요에 따라 딜레이 조정

        // );
      }
      google.maps.event.trigger(
        this,
        MarkerClustererEvents.CLUSTERING_END,
        this,
      );
    }
  }
}
