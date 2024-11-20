import { Loader } from '@googlemaps/js-api-loader';

let isApiLoaded = false;
let GoogleMapClass: typeof google.maps.Map | null = null;
let AdvancedMarkerElementClass:
  | typeof google.maps.marker.AdvancedMarkerElement
  | null = null;
let PlaceClass: typeof google.maps.places.Place | null = null;

export async function loadGoogleMapsApi() {
  if (isApiLoaded) {
    return;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('Google Maps API 키가 설정되지 않았습니다.');
  }

  const loader = new Loader({
    apiKey: apiKey,
    version: '3.58',
  });

  await loader.load();

  const { Map } = (await google.maps.importLibrary(
    'maps',
  )) as google.maps.MapsLibrary;

  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    'marker',
  )) as google.maps.MarkerLibrary;
  const { Place } = (await google.maps.importLibrary(
    'places',
  )) as google.maps.PlacesLibrary;

  GoogleMapClass = Map;
  AdvancedMarkerElementClass = AdvancedMarkerElement;
  PlaceClass = Place;
  isApiLoaded = true;
}

export function getGoogleMapClass() {
  if (!GoogleMapClass) {
    throw new Error('Google Maps API가 아직 로드되지 않았습니다.');
  }
  return GoogleMapClass;
}

export function getMarkerClass() {
  if (!AdvancedMarkerElementClass) {
    throw new Error('Google Maps API가 아직 로드되지 않았습니다.');
  }
  return AdvancedMarkerElementClass;
}

export function getPlaceClass() {
  if (!PlaceClass) {
    throw new Error('Google Maps API가 아직 로드되지 않았습니다.');
  }
  return PlaceClass;
}
