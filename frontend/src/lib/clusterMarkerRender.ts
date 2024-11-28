import {
  Cluster,
  ClusterStats,
  MarkerUtils,
} from '@googlemaps/markerclusterer';

export const clusterMarkerRender = (
  { count, position }: Cluster,
  stats: ClusterStats,
  map: google.maps.Map,
) => {
  const color =
    count > Math.max(10, stats.clusters.markers.mean) ? '#88BDF2' : '#BDDDFC';

  const svg = `<svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
<circle cx="120" cy="120" opacity="1" r="90" />
<text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="Pretendard,roboto,arial,sans-serif">${count}</text>
</svg>`;

  const zIndex: number = Number(google.maps.Marker.MAX_ZINDEX) + count;

  if (MarkerUtils.isAdvancedMarkerAvailable(map)) {
    const parser = new DOMParser();
    const svgEl = parser.parseFromString(svg, 'image/svg+xml').documentElement;
    svgEl.setAttribute('transform', 'translate(0 25)');

    const clusterOptions: google.maps.marker.AdvancedMarkerElementOptions = {
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
};
